import ChFlowProvider from './components/ChFlow';
import { ChTableNodeProps } from './components/ChTableNode';
import { ChConnectionSettings } from './db';
import { getModel } from './db/model';

export default async function Home() {
  const connectionSettings: ChConnectionSettings = {
    url: "http://localhost:48123",
    username: "developer",
    password: "developer",
  };

  const model = await getModel(connectionSettings, ["flow_test"]);

  const tableNodes = model.getTables<ChTableNodeProps>((entry) => {
    return {
      table: {
        name: entry.fullName,
        engine: entry.table.engine,
        hasOwnData: entry.table.hasOwnData,
        columns: entry.columns.map(column => ({
          position: column.position,
          name: column.name,
          type: column.type,
          defaultKind: column.defaultKind,
          defaultExpression: column.defaultExpression
        }))
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