import ChFlowProvider from './components/ChFlow';
import { ChTableNodeProps } from './components/ChTableNode';
import { ChConnectionSettings } from './db';
import { getModel } from './db/model';

export default async function Home() {
  const connectionSettings: ChConnectionSettings = {
    url: 'http://localhost:48123',
    username: 'developer',
    password: 'developer',
  };

  const model = await getModel(connectionSettings, ['flow_test']);
  const presentationDatabase = 'flow_test';

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

  return (
    <div style={{ height: '100vh' }}>
      <ChFlowProvider
        tableNodes={tableNodes}
        transitions={transitions}
      />
    </div>
  );
};

function trimNamePrefix(input: string, prefix: string): string {
  if (input.startsWith(prefix)) {
    return input.slice(prefix.length);
  }
  return input;
}

function getEngineRepresentation(engine: string, engineFull: string): string {
  const match = engineFull.match(/^(\w+\s*\([^)]*\))/);
  return match ? match[0] : engine;
}