import { ClickHouseClient, executeQuery } from '.';
import { format } from 'sql-formatter';

export type ChTable = {
    database: string;
    name: string;
    engine: string;
    engineFull: string;
    createCommand: string;
    asSelect: string | null;
    hasOwnData: boolean;
    partitionKey: string;
    sortingKey: string;
    primaryKey: string;
    samplingKey: string;
};

export const getTables = async (client: ClickHouseClient, databases: string[]): Promise<ChTable[]> => {
    const params = { 'databases': databases };

    const tables = await executeQuery<ChTable>(client, getTablesSql, params);

    return tables.map((table) => ({
        ...table,
        createCommand: formatSql(table.createCommand)!,
        asSelect: formatSql(table.asSelect),
  }));
};

const formatSql = (sql: string | null): string | null =>
    sql ? format(sql, { language: 'clickhouse', expressionWidth: 40}) : null;

const getTablesSql: string = `
select
    database,
    name,
    engine,
    engine_full as engineFull,
    create_table_query as createCommand,
    as_select as asSelect,
    has_own_data as hasOwnData,
    partition_key as partitionKey,
    sorting_key as sortingKey,
    primary_key as primaryKey,
    sampling_key as samplingKey
from system.tables
where database in {databases: Array(String)} and not is_temporary
`;