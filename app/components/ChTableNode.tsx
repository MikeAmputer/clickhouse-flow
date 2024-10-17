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