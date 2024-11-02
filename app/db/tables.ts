import { ClickHouseClient, executeQuery } from '.';

export type ChTable = {
    database: string;
    name: string;
    engine: string;
    engineFull: string;
    createCommand: string;
    asSelect: string;
    hasOwnData: boolean;
    partitionKey: string;
    sortingKey: string;
    primaryKey: string;
    samplingKey: string;
};

export const getTables = async (client: ClickHouseClient, databases: string[]): Promise<ChTable[]> => {
    const params = { 'databases': databases };

    const tables = await executeQuery<ChTable>(client, getTablesSql, params);

    return tables;
};

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