// temporary config

import { ChConnectionSettings } from '@/app/db';

export interface DatabaseConfig {
  connectionSettings: ChConnectionSettings;
  targetDatabases: string[];
  presentationDatabase: string;
};

export const databaseConfigs = new Map<string, DatabaseConfig>([
  ['flow_test', {
    connectionSettings: {
      url: 'http://localhost:48123',
      username: 'developer',
      password: 'developer',
    },
    targetDatabases: ['flow_test'],
    presentationDatabase: 'flow_test',
  }]
]);
