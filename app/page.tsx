'use client'

import { ChTableNodeProps } from './components/ChTableNode';
import DatabaseSelector from './components/DatabaseSelector';
import ChFlowProvider, { ChFlowProps } from './components/ChFlow';
import { ChModel } from './classes/ChModel';
import { getDatabaseInfo, getAvailableDatabases } from '@/app/actions';
import { useTransition, useState, useEffect } from 'react';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [flowProps, setFlowProps] = useState<ChFlowProps>({ tableNodes: [], transitions: [] });
  const [currentDb, setCurrentDb] = useState<string>('no-db-selected');

  const [databases, setDatabases] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const dbs = await getAvailableDatabases();
      setDatabases(dbs);
    })();
  }, []);

  const onDbSelect = (dbConfigName: string) => {
    startTransition(async () => {
      const dbInfo = await getDatabaseInfo(dbConfigName);
      const presentationDatabase = dbInfo.presentationDatabase;
      const model = new ChModel(dbInfo.tables, dbInfo.columns);

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

      setFlowProps({ tableNodes: tableNodes, transitions: transitions, dbConfigName: dbConfigName });
      setCurrentDb(dbConfigName);
    });
  };

  return (
    <div style={{ height: '100vh' }}>
      <DatabaseSelector
        databases={databases}
        callback={onDbSelect}
      />

      <ChFlowProvider key={currentDb} {...flowProps} />
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