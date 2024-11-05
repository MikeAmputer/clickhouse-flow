import ChTable, { ChTableProps } from "./ChTable";
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from "@xyflow/react";

export type ChTableNodeProps = {
    table: ChTableProps;
    inTables?: number | null;
    outTables?: number | null;
};

export type ChTableNode = Node<ChTableNodeProps>;

export default function ChTableNode({ data }: NodeProps<ChTableNode>) {
    return (
        <>
            {data.inTables != null && Array.from({ length: data.inTables }).map((_, index) => (
                <Handle
                    key={`${data.table.fullName}-in-${index}`}
                    id={`${data.table.fullName}-in-${index}`}
                    type="target"
                    position={Position.Left}
                    style={{
                        top: calculateHandlePosition(index, data.inTables as number),
                        left: -4,
                        transform: 'scale(0)',
                    }}
                    isConnectable={false}
                />
            ))}

            <ChTable {...data.table} />

            {data.outTables != null && Array.from({ length: data.outTables }).map((_, index) => (
                <Handle
                    key={`${data.table.fullName}-out-${index}`}
                    id={`${data.table.fullName}-out-${index}`}
                    type="source"
                    position={Position.Right}
                    style={{
                        top: calculateHandlePosition(index, data.outTables as number),
                        right: 3,
                        transform: 'scale(0)',
                    }}
                    isConnectable={false}
                />
            ))}
        </>
    );
};

const calculateHandlePosition = (index: number, total: number) => {
    return `${(index + 1) * (100 / (total + 1))}%`;
};