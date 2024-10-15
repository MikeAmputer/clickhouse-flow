import { memo } from "react";
import ChTable, { ChTableProps } from "./ChTable";
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from "@xyflow/react";

export type ChTableNodeProps = {
    table: ChTableProps;
}

export type ChTableNode = Node<ChTableNodeProps>;

export default function ChTableNode({ data }: NodeProps<ChTableNode>) {
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                isConnectable={false}
            />
            <ChTable {...data.table} />
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
                isConnectable={false}
            />
        </>
    );
}

// const DbTableNode: React.FC<NodeProps<ChTableNode>> = memo(function ChTableNode({ data }: NodeProps<ChTableNode>) {
//     const table: ChTableProps = data.table;

//     return (
//         <>
//             <Handle
//                 type="target"
//                 position={Position.Left}
//                 style={{ background: '#555' }}
//                 isConnectable={false}
//             />
//             <DbTable name={table.name} columns={table.columns} />
//             <Handle
//                 type="source"
//                 position={Position.Right}
//                 style={{ background: '#555' }}
//                 isConnectable={false}
//             />
//         </>
//     );
// });

// export default ChTableNode;