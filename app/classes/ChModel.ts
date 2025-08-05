import { ChTable } from '@/app/db/tables';
import { ChColumn } from '@/app/db/columns';

export class ChModel {
    private tables: Map<string, TableEntry>;
    private transitions: TableTransition[];

    constructor(tables: ChTable[], columns: ChColumn[], respectJoins: boolean) {
        this.tables = new Map();
        this.transitions = [];

        tables.forEach((table) => {
            const fullName = composeFullTableName(table.database, table.name);

            const refreshable = table.engine === "MaterializedView"
                ? extractRefreshExpression(table.createCommand)
                : null;

            const entry: TableEntry = {
                fullName,
                table,
                columns: [],
                refreshable,
            };

            this.tables.set(fullName, entry);
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
            const tableTransitions = composeTransitions(entry.table.createCommand, key, respectJoins);
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
    refreshable: string | null;
};

type TableTransition = {
    source: string;
    target: string;
};

function composeFullTableName(database: string, table: string): string {
    return `${database}.${table}`;
};

function composeTransitions(
    createCommand: string,
    fullName: string,
    respectJoins: boolean = false): TableTransition[] {

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

    if (respectJoins) {
        matchTransitions(createCommand, fullName, false, joinRegex)
            .forEach((t) => {
                result.push(t);
            });
    }

    return result;
};

function matchTransitions(
    createCommand: string,
    fullName: string,
    isSource: boolean,
    regex: RegExp): TableTransition[] {

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

/**
 * @internal
 * internal for tests
 */
export function extractRefreshExpression(createCommand: string): string | null {
    const regex = /REFRESH\s+EVERY\s+((?:\d+\s+\w+\s*)+)/i;

    const refreshMatch = createCommand.match(regex);
    if (!refreshMatch) return null;

    const refreshExpr = refreshMatch[1].trim();
    const parts = refreshExpr.split(/\s+/);

    for (let i = 0; i < parts.length; i += 2) {
        const value = parts[i];
        const unit = parts[i + 1]?.toUpperCase();

        if (!/^\d+$/.test(value) || !supportedIntervals.has(unit.toUpperCase())) {
            return null;
        }
    }

    return `REFRESH EVERY ${parts.map(p => p.toUpperCase()).join(' ')}`;
};

const supportedIntervals = new Set([
    "NANOSECOND", "NANOSECONDS",
    "MICROSECOND", "MICROSECONDS",
    "MILLISECOND", "MILLISECONDS",
    "SECOND", "SECONDS",
    "MINUTE", "MINUTES",
    "HOUR", "HOURS",
    "DAY", "DAYS",
    "WEEK", "WEEKS",
    "MONTH", "MONTHS",
    "QUARTER", "QUARTERS",
    "YEAR", "YEARS",
]);