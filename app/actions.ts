'use server'

import {
  getConfig,
  getDatabaseConfigs,
  DatabaseConfig,
  ExportConfig,
  CanvasConfig
} from '@/app/config';

import { createClient } from '@/app/db';
import { ChTable, getTables } from '@/app/db/tables';
import { ChColumn, getColumns } from '@/app/db/columns';

export async function getAvailableDatabases(): Promise<string[]> {
  return getConfig().databaseConfigs.map(c => c.name);
}

export interface DatabaseInfo {
  tables: ChTable[];
  columns: ChColumn[];
  presentationDatabase: string;
  respectJoins: boolean;
}

export async function getDatabaseInfo(configName: string): Promise<DatabaseInfo> {
  const databaseConfig = getDatabaseConfigs().get(configName) as DatabaseConfig;
  const settings = databaseConfig.connectionSettings;
  const databases = databaseConfig.targetDatabases;

  const client = createClient(settings);

  const tables = await getTables(client, databases);
  const columns = await getColumns(client, databases);

  client.close();

  return {
    tables,
    columns,
    presentationDatabase: databaseConfig.presentationDatabase,
    respectJoins: databaseConfig.respectJoins,
  };
}

export interface AppSettings {
  exportConfig: ExportConfig;
  canvasConfig: CanvasConfig;
}

export async function getAppSettings(): Promise<AppSettings> {
  const config = getConfig();
  return {
    exportConfig: config.exportConfig,
    canvasConfig: config.canvasConfig,
  }
}
