import ChTable, { ChTableProps } from "./ChTable";
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from "@xyflow/react";

export type ChTableNodeProps = {
    table: ChTableProps;
    inTables?: number | null;
    outTables?: number | null;
}

export type ChTableNode = Node<ChTableNodeProps>;

export default function ChTableNode({ data }: NodeProps<ChTableNode>) {
    const calculateHandlePosition = (index: number, total: number) => {
        return `${(index + 1) * (100 / (total + 1))}%`;
    };

    return (
        <>
            {data.inTables != null && Array.from({ length: data.inTables }).map((_, index) => (
                <Handle
                    key={`${data.table}-in-${index}`}
                    type="target"
                    position={Position.Left}
                    id={`left-${index}`}
                    style={{ top: calculateHandlePosition(index, data.inTables as number), background: '#555' }}
                    isConnectable={false}
                />
            ))}

            <ChTable {...data.table} />

            {data.outTables != null && Array.from({ length: data.outTables }).map((_, index) => (
                <Handle
                    key={`${data.table}-out-${index}`}
                    type="source"
                    position={Position.Right}
                    id={`right-${index}`}
                    style={{ top: calculateHandlePosition(index, data.outTables as number), background: '#555' }}
                    isConnectable={false}
                />
            ))}
        </>
    );
}