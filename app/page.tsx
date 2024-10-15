import { ChTableColumn } from './components/ChTable';
import ChFlow from './components/ChFlow';

const cols1: ChTableColumn[] = [
  { position: 1, name: 'server_id', type: 'UInt8', defaultKind: '', defaultExpression: '' },
  { position: 2, name: 'user_id', type: 'UInt32', defaultKind: '', defaultExpression: '' },
  { position: 3, name: 'order_id', type: 'UInt32', defaultKind: '', defaultExpression: '' },
];

const cols2: ChTableColumn[] = [
  { position: 1, name: 'server_id_2', type: 'UInt64', defaultKind: '', defaultExpression: '' },
  { position: 2, name: 'user_id_2', type: 'UInt64', defaultKind: '', defaultExpression: '' },
];


export default function Home() {
  return (
    <div style={{ height: '100vh' }}>
      <ChFlow tableNodes={[
        { table: { name: 'table1', columns: cols1 } },
        { table: { name: 'table2', columns: cols2 } }
      ]} />
    </div>
  );
}