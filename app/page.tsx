'use client'

import { useTransition, useState, useEffect } from 'react';
import { ChTableNodeProps } from './components/ChTableNode';
import DatabaseSelector from './components/DatabaseSelector';
import ChFlowProvider, { ChFlowProps } from './components/ChFlow';
import { ChModel } from './classes/ChModel';

import {
  getDatabaseInfo,
  getAvailableDatabases,
  type AppSettings,
  getAppSettings
} from '@/app/actions';

export default function Home() {
  const [isPending, startTransition] = useTransition();

  const [flowProps, setFlowProps] = useState<ChFlowProps>({
    tableNodes: [],
    transitions: [],
    appSettings: null,
    dbConfigName: null
  });

  const [currentDb, setCurrentDb] = useState<string>('no-db-selected');

  const [databases, setDatabases] = useState<string[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const dbs = await getAvailableDatabases();
        setDatabases(dbs);

        const aps = await getAppSettings();
        setAppSettings(aps);

        setFlowProps({
          tableNodes: [],
          transitions: [],
          appSettings: aps,
          dbConfigName: null
        });
      } catch (error) {
        console.error('Failed to initialize app settings:', error);
      }
    })();
  }, []);

  const onDbSelect = (dbConfigName: string) => {
    if (!appSettings) {
      return;
    }

    startTransition(async () => {
      const dbInfo = await getDatabaseInfo(dbConfigName);
      const presentationDatabase = dbInfo.presentationDatabase;
      const model = new ChModel(dbInfo.tables, dbInfo.columns, dbInfo.respectJoins);

      const tableNodes = model.getTables<ChTableNodeProps>((entry) => {
        const table = entry.table;

        return {
          table: {
            fullName: entry.fullName,
            presentationName: trimNamePrefix(entry.fullName, `${presentationDatabase}.`),
            engine: getEngineRepresentation(table.engine, table.engineFull),
            hasOwnData: table.hasOwnData,
            columns: entry.columns.map(column => ({
              position: column.position,
              name: column.name,
              type: column.type,
              defaultKind: column.defaultKind,
              defaultExpression: column.defaultExpression
            })),
            primaryKey: table.primaryKey,
            sortingKey: table.sortingKey,
            partitionKey: table.partitionKey,
            samplingKey: table.samplingKey,
          },
        }
      });

      const transitions = model.getTransitions();

      setFlowProps({
        tableNodes: tableNodes,
        transitions: transitions,
        appSettings: appSettings,
        dbConfigName: dbConfigName
      });

      setCurrentDb(dbConfigName);
    });
  };

  return (
    <div style={{ height: '100vh' }}>
      {appSettings && (
        <>
          <DatabaseSelector
            databases={databases}
            callback={onDbSelect}
          />


          <ChFlowProvider key={currentDb} {...flowProps} />
        </>
      )}
    </div>
  );
};

function trimNamePrefix(input: string, prefix: string): string {
  if (input.startsWith(prefix)) {
    return input.slice(prefix.length);
  }
  return input;
};

function getEngineRepresentation(engine: string, engineFull: string): string {
  const match = engineFull.match(/^(\w+\s*\([^)]*\))/);
  return match ? match[0] : engine;
};