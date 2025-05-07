import fs from 'fs';
import path from 'path';
import type { ChConnectionSettings } from '@/app/db';
import { ENV } from './env';

export interface ConfigFile {
  databaseConfigs: DatabaseConfigEntry[];
  exportConfig: ExportConfig;
}

export interface DatabaseConfigEntry {
  name: string;
  config: DatabaseConfig;
}

export interface DatabaseConfig {
  connectionSettings: ChConnectionSettings;
  targetDatabases: string[];
  presentationDatabase: string;
}

export interface ExportConfig {
  format: 'PDF' | 'SVG';
  padding: number;
}

const defaultConfig: ConfigFile =
{
  databaseConfigs: [],
  exportConfig: {
    format: 'PDF',
    padding: 20,
  }
};

function getDefaultDatabaseConfig(): { dbConfig: DatabaseConfig, configName: string } | null {
  const {
    CHF_DEFAULT_DB_URL: url,
    CHF_DEFAULT_DB_USERNAME: username,
    CHF_DEFAULT_DB_PASSWORD: password,
    CHF_DEFAULT_DB_NAME: name } = ENV;

  if (url && username && password && name) {
    return {
      dbConfig: {
        connectionSettings: { url, username, password },
        targetDatabases: [name],
        presentationDatabase: name,
      },
      configName: ENV.CHF_DEFAULT_DB_CONFIG_NAME ?? name
    };
  }

  return null;
}

function loadConfigFile(): ConfigFile | null {
  const configPath: string = ENV.NODE_ENV !== 'production'
    ? path.resolve('./app/config/dev-config.json')
    : ENV.CHF_CONFIG_PATH;

  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8').trim();
      return raw ? (JSON.parse(raw) as ConfigFile) : null;
    }
  } catch (err) {
    console.error(`Error loading config from ${configPath}:`, err);
  }
  return null;
}

function substituteEnv(config: ConfigFile) {
  config.exportConfig ??= { ...defaultConfig.exportConfig };

  config.exportConfig.format = ENV.CHF_EXPORT_FORMAT ?? config.exportConfig.format ?? defaultConfig.exportConfig.format;
  config.exportConfig.padding = ENV.CHF_EXPORT_PADDING ?? config.exportConfig.padding ?? defaultConfig.exportConfig.padding;
}

let cachedConfig: ConfigFile | null = null;

export function getConfig(): ConfigFile {
  if (cachedConfig) {
    return cachedConfig;
  }

  const config = loadConfigFile() ?? structuredClone(defaultConfig);

  const defaultDbConfig = getDefaultDatabaseConfig();

  if (defaultDbConfig) {
    const defaultEntry: DatabaseConfigEntry = {
      name: defaultDbConfig.configName,
      config: defaultDbConfig.dbConfig,
    };

    config.databaseConfigs.unshift(defaultEntry);
  }

  substituteEnv(config);

  if (ENV.CHF_CACHE_CONFIG) {
    cachedConfig = config;
  }

  return config;
}

export function getDatabaseConfigs(): Map<string, DatabaseConfig> {
  const result = getConfig().databaseConfigs.reduce(
    (map, entry) => map.set(entry.name, entry.config),
    new Map<string, DatabaseConfig>()
  );

  return result;
}