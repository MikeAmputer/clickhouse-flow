'use client'

import {
    ReactFlow,
    Node,
    useNodesState,
    MiniMap,
    Controls,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { ChTableNodeProps } from "./ChTableNode";
import { nodeTypes, type CustomNodeType } from "../nodes";

export type ChFlowProps = {
    tableNodes: ChTableNodeProps[];
}

const ChFlow: React.FC<ChFlowProps> = ({ tableNodes }) => {
    const nodeArray = [
        {
            id: '1',
            type: 'ch-table',
            data: { table: tableNodes[0].table },
            style: { border: '1px solid #777', padding: 10 },
            position: { x: 0, y: 0 },
        }
    ] satisfies Node[];

    const [nodes, , onNodesChange] = useNodesState<CustomNodeType>(nodeArray);

    return (
        <ReactFlow
            style={{ background: '#e0e0dc' }}
            nodes={nodes}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            fitView
        >
            <MiniMap
                nodeStrokeColor={(n) => {
                    if (n.type === 'ch-table') return '#fffec8';
                    return '#fff';
                }}
                nodeColor={(n) => {
                    if (n.type === 'ch-table') return '#fffec8';
                    return '#fff';
                }}
            />
            <Controls />
        </ReactFlow>
    );
};

export default ChFlow;