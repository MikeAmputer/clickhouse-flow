import { ChColumnProps } from './components/ChColumn';
import ChFlow from './components/ChFlow';

const cols1: ChColumnProps[] = [
  { position: 1, name: 'server_id', type: 'UInt8', defaultKind: '', defaultExpression: '' },
  { position: 2, name: 'user_id', type: 'UInt32', defaultKind: '', defaultExpression: '' },
  { position: 3, name: 'order_id', type: 'UInt32', defaultKind: '', defaultExpression: '' },
];

const cols2: ChColumnProps[] = [
  { position: 1, name: 'server_id_very_long_column_name', type: 'UInt64', defaultKind: '', defaultExpression: '' },
  { position: 2, name: 'user_id', type: 'UInt64', defaultKind: '', defaultExpression: '' },
  { position: 3, name: 'time_very_long_column_name', type: 'DateTime64(\'UTC\', 3)', defaultKind: 'MATERIALIZED', defaultExpression: 'utcNow()' },
];

const cols3: ChColumnProps[] = [
  { position: 1, name: 'server_id', type: 'UInt64', defaultKind: '', defaultExpression: '' },
  { position: 2, name: 'user_id', type: 'UInt64', defaultKind: '', defaultExpression: '' },
  { position: 3, name: 'time', type: 'DateTime64(\'UTC\', 3)', defaultKind: '', defaultExpression: '' },
];

const transitions: [source: string, target: string][] = [
  ['my_fancy_table_228', 'my_fancy_table_with_long_column_names'],
  ['my_fancy_table_228', 'my_fancy_table_with_long_column_names'],
  ['my_fancy_table_with_long_column_names', 'my_fancy_table_3'],
  ['my_fancy_table_with_long_column_names', 'my_fancy_table_3'],
];

export default function Home() {
  return (
    <div style={{ height: '100vh' }}>
      <ChFlow
        tableNodes={[
          { table: { name: 'my_fancy_table_228', columns: cols1 } },
          { table: { name: 'my_fancy_table_with_long_column_names', columns: cols2 } },
          { table: { name: 'my_fancy_table_3', columns: cols3 } },
        ]}
        transitions={transitions}
      />
    </div>
  );
}