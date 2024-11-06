'use server'

import { databaseConfigs, DatabaseConfig } from '@/app/config';
import { createClient } from '@/app/db';
import { ChTable, getTables } from '@/app/db/tables';
import { ChColumn, getColumns } from '@/app/db/columns';

export const getDatabaseInfo = async (configName: string)
  : Promise<[tables: ChTable[], columns: ChColumn[]]> => {
  const databaseConfig = databaseConfigs.get(configName) as DatabaseConfig;
  const settings = databaseConfig.connectionSettings;
  const databases = databaseConfig.targetDatabases;

  const client = createClient(settings);

  const tables = await getTables(client, databases);
  const columns = await getColumns(client, databases);

  client.close();

  return [tables, columns];
};
