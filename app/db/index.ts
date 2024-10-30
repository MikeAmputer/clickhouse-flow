import { ClickHouseClient, createClient as createChClient } from '@clickhouse/client';
import type { Row } from '@clickhouse/client-common';

export { ClickHouseClient };

export type ChConnectionSettings = {
    url: string;
    username: string;
    password: string;
}

export const createClient = (settings: ChConnectionSettings): ClickHouseClient => {
    return createChClient({
        url: settings.url,
        database: "system",
        username: settings.username,
        password: settings.password,
    });
}

export const executeQuery = async <T>(client: ClickHouseClient, query: string, params?: Record<string, unknown>): Promise<T[]> => {
    const resultSet = await client.query({
        query: query,
        format: 'JSONEachRow',
        query_params: params,
    });

    const stream = resultSet.stream();
    const result: T[] = [];

    return new Promise((resolve, reject) => {
        stream.on('data', (data: Row[]) => {
            data.forEach((dataRow: Row) => {
                var parsed = dataRow.json() as T;
                result.push(parsed)
            })
        });

        stream.on('end', () => {
            resolve(result);
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
};