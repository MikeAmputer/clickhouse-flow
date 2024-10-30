import { ClickHouseClient, executeQuery } from '.';

export type ChColumn = {
    database: string;
    table: string;
    name: string;
    type: string;
    position: number;
    defaultKind: string;
    defaultExpression: string;
}

export const getColumns = async (client: ClickHouseClient, databases: string[]): Promise<ChColumn[]> => {
    const params = { 'databases': databases };

    const tables = await executeQuery<ChColumn>(client, getColumnsSql, params);

    return tables;
}

const getColumnsSql: string = `
select
    database,
    table,
    name,
    type,
    position,
    default_kind as defaultKind,
    default_expression as defaultExpression
from system.columns
where database in {databases: Array(String)}
`;