import { ChConnectionSettings, createClient } from '.';
import { ChTable, getTables } from './tables';
import { ChColumn, getColumns } from './columns';

export const getModel = async (settings: ChConnectionSettings, databases: string[]): Promise<ChModel> => {
    const client = createClient(settings);

    const tables = await getTables(client, databases);
    const columns = await getColumns(client, databases);

    client.close();

    return new ChModel(tables, columns);
};

export class ChModel {
    private tables: Map<string, TableEntry>;
    private transitions: TableTransition[];

    constructor(tables: ChTable[], columns: ChColumn[]) {
        this.tables = new Map();
        this.transitions = [];

        tables.forEach((table) => {
            const fullName = composeFullTableName(table.database, table.name);
            this.tables.set(fullName, { fullName, table, columns: [] });
        });

        columns.forEach((column) => {
            const key = composeFullTableName(column.database, column.table);
            const entry = this.tables.get(key);

            if (entry) {
                entry.columns.push(column);
            }
        });

        this.tables.forEach((entry, key) => {
            entry.columns.sort((a, b) => a.position - b.position);
            const tableTransitions = composeTransitions(entry.table.createCommand, key);
            tableTransitions.forEach((transition) => {
                if (this.tables.has(transition.source) && this.tables.has(transition.target)) {
                    this.transitions.push(transition);
                }
            });
        });
    }

    public getTables<T>(mapper: (entry: TableEntry) => T): T[] {
        return Array.from(this.tables.values()).map(mapper);
    };

    public getTransitions(): [source: string, target: string][] {
        return this.transitions.map((t) => [t.source, t.target]);
    };
};

type TableEntry = {
    fullName: string;
    table: ChTable;
    columns: ChColumn[];
};

type TableTransition = {
    source: string;
    target: string;
};

const composeFullTableName = (database: string, table: string): string => {
    return `${database}.${table}`;
};

const composeTransitions = (
    createCommand: string,
    fullName: string,
    includeJoins: boolean = false): TableTransition[] => {

    const toRegex = /TO\s+(?:`([^`]+)`|([a-zA-Z0-9_]+))\.(?:`([^`]+)`|([a-zA-Z0-9_]+))\s+/gi;
    const fromRegex = /FROM\s+(?:`([^`]+)`|([a-zA-Z0-9_]+))\.(?:`([^`]+)`|([a-zA-Z0-9_]+))(?:\s+|$)/gi;
    const joinRegex = /JOIN\s+(?:`([^`]+)`|([a-zA-Z0-9_]+))\.(?:`([^`]+)`|([a-zA-Z0-9_]+))\s+/gi;

    const result: TableTransition[] = [];

    matchTransitions(createCommand, fullName, true, toRegex)
        .forEach((t) => {
            result.push(t);
        });

    matchTransitions(createCommand, fullName, false, fromRegex)
        .forEach((t) => {
            result.push(t);
        });

    if (includeJoins) {
        matchTransitions(createCommand, fullName, false, joinRegex)
            .forEach((t) => {
                result.push(t);
            });
    }

    return result;
};

const matchTransitions = (
    createCommand: string,
    fullName: string,
    isSource: boolean,
    regex: RegExp): TableTransition[] => {

    const result: TableTransition[] = [];

    const matches = [...createCommand.matchAll(regex)];
    matches.map((match) => {
        const databaseName = match[1] || match[2];
        const tableName = match[3] || match[4];

        const fullMatchedName = composeFullTableName(databaseName, tableName).replace('\\\\', '\\');

        if (isSource) {
            result.push({
                source: fullName,
                target: fullMatchedName
            });
        }
        else {
            result.push({
                source: fullMatchedName,
                target: fullName
            });
        };
    });

    return result;
};