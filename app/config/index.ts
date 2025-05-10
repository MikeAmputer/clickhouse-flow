import fs from 'fs';
import path from 'path';
import type { ChConnectionSettings } from '@/app/db';
import { ENV } from './env';

export interface ConfigFile {
  databaseConfigs: DatabaseConfigEntry[];
  exportConfig: ExportConfig;
  canvasConfig: CanvasConfig;
}

export interface DatabaseConfigEntry {
  name: string;
  config: DatabaseConfig;
}

export interface DatabaseConfig {
  connectionSettings: ChConnectionSettings;
  targetDatabases: string[];
  presentationDatabase: string;
  respectJoins: boolean;
}

export interface ExportConfig {
  format: 'PDF' | 'SVG';
  padding: number;
}

export interface CanvasConfig {
  snapToGrid: boolean;
  gridSize: number;
  backgroundColor: string;
  autoFitView: boolean;
}

const defaultConfig: ConfigFile =
{
  databaseConfigs: [],
  exportConfig: {
    format: 'PDF',
    padding: 20,
  },
  canvasConfig: {
    snapToGrid: true,
    gridSize: 15,
    backgroundColor: "#e0e0dc",
    autoFitView: true,
  },
};

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

function getDefaultDatabaseConfig(): { dbConfig: DatabaseConfig, configName: string } | null {
  const {
    CHF_DB_URL: url,
    CHF_DB_USERNAME: username,
    CHF_DB_PASSWORD: password,
    CHF_DB_NAME: name } = ENV;

  if (url && username && password && name) {
    return {
      dbConfig: {
        connectionSettings: { url, username, password },
        targetDatabases: [name],
        presentationDatabase: name,
        respectJoins: true,
      },
      configName: ENV.CHF_DB_CONFIG_NAME ?? name
    };
  }

  return null;
}

function setupDbConfigs(config: ConfigFile) {
  config.databaseConfigs ??= [];

  const defaultDbConfig = getDefaultDatabaseConfig();

  if (defaultDbConfig) {
    const defaultEntry: DatabaseConfigEntry = {
      name: defaultDbConfig.configName,
      config: defaultDbConfig.dbConfig,
    };

    config.databaseConfigs.unshift(defaultEntry);

    // TODO: default values for db configs missing properties
  }
}

function substituteEnv(config: ConfigFile) {
  config.exportConfig ??= { ...defaultConfig.exportConfig };

  config.exportConfig.format = ENV.CHF_EXPORT_FORMAT
    ?? config.exportConfig.format
    ?? defaultConfig.exportConfig.format;

  config.exportConfig.padding = ENV.CHF_EXPORT_PADDING
    ?? config.exportConfig.padding
    ?? defaultConfig.exportConfig.padding;

  config.canvasConfig ??= { ...defaultConfig.canvasConfig };

  config.canvasConfig.snapToGrid = ENV.CHF_CANVAS_SNAP_TO_GRID
    ?? config.canvasConfig.snapToGrid
    ?? defaultConfig.canvasConfig.snapToGrid;

  config.canvasConfig.gridSize = ENV.CHF_CANVAS_GRID_SIZE
    ?? config.canvasConfig.gridSize
    ?? defaultConfig.canvasConfig.gridSize;

  config.canvasConfig.backgroundColor = ENV.CHF_CANVAS_BACKGROUND_COLOR
    ?? config.canvasConfig.backgroundColor
    ?? defaultConfig.canvasConfig.backgroundColor;

  config.canvasConfig.autoFitView = ENV.CHF_CANVAS_AUTO_FIT_VIEW
    ?? config.canvasConfig.autoFitView
    ?? defaultConfig.canvasConfig.autoFitView;
}

let cachedConfig: ConfigFile | null = null;

export function getConfig(): ConfigFile {
  if (cachedConfig) {
    return cachedConfig;
  }

  const config = loadConfigFile() ?? structuredClone(defaultConfig);

  setupDbConfigs(config);
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