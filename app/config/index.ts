import fs from 'fs';
import path from 'path';
import type { ChConnectionSettings } from '@/app/db';
import { ENV } from './env';

export interface ConfigFile {
  databaseConfigs: DatabaseConfigEntry[];
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

function getDefaultDatabaseConfig(): DatabaseConfig | null {
  const {
    CHF_DEFAULT_DB_URL: url,
    CHF_DEFAULT_DB_USERNAME: username,
    CHF_DEFAULT_DB_PASSWORD: password,
    CHF_DEFAULT_DB_NAME: name } = ENV;

  if (url && username && password && name) {
    return {
      connectionSettings: { url, username, password },
      targetDatabases: [name],
      presentationDatabase: name,
    };
  }

  return null;
}

function loadConfigFile(): ConfigFile | null {
  const configPath: string = ENV.NODE_ENV !== 'production'
    ? path.resolve('./app/config/dev-config.json')
    : ENV.CHF_CONFIG_PATH || '/app/config/config.json';

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

function createEmptyConfig(): ConfigFile {
  return {
    databaseConfigs: [],
  }
}

let cachedConfig: ConfigFile | null = null;

export function getConfig(): ConfigFile {
  if (cachedConfig) {
    return cachedConfig;
  }

  const config = loadConfigFile() ?? createEmptyConfig();

  const defaultDbConfig = getDefaultDatabaseConfig();

  if (defaultDbConfig) {
    const defaultEntry: DatabaseConfigEntry = {
      name: 'default',
      config: defaultDbConfig,
    };

    config.databaseConfigs.unshift(defaultEntry);
  }

  cachedConfig = config;

  return config;
}

export function getDatabaseConfigs(): Map<string, DatabaseConfig> {
  const result = getConfig().databaseConfigs.reduce(
    (map, entry) => map.set(entry.name, entry.config),
    new Map<string, DatabaseConfig>()
  );

  return result;
}