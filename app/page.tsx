import ChFlow from './components/ChFlow';
import { ChTableNodeProps } from './components/ChTableNode';
import { ChConnectionSettings } from './db';
import { getModel } from './db/model';

export default async function Home() {
  const connectionSettings: ChConnectionSettings = {
    url: "http://localhost:48123",
    username: "developer",
    password: "developer",
  }

  const model = await getModel(connectionSettings, ["flow_test"]);

  const tableNodes = model.getTables<ChTableNodeProps>((entry) => {
    return {
      table: {
        name: entry.fullName,
        columns: entry.columns.map(column => ({
          position: column.position,
          name: column.name,
          type: column.type,
          defaultKind: column.defaultKind,
          defaultExpression: column.defaultExpression
        }))
      },
      width: Math.max(
        entry.fullName.length,
        entry.columns.reduce((max, column) => {
          const currentLength = column.name.length + column.type.length;
          return Math.max(max, currentLength);
        }, 0)
      ) * 10 + 20,
      height: entry.columns.length * 20 + 40,
    }
  });

  const transitions = model.getTransitions();

  return (
    <div style={{ height: '100vh' }}>
      <ChFlow
        tableNodes={tableNodes}
        transitions={transitions}
      />
    </div>
  );
}