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
    const nodeArray = tableNodes.map((node, index) => ({
        id: node.table.name,
        type: 'ch-table',
        data: { table: node.table },
        style: { border: '0px solid #777', padding: 3 },
        position: { x: index * 250, y: 0 },
    })) satisfies Node[];

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
            <Controls style={{ color: '#000' }} />
        </ReactFlow>
    );
};

export default ChFlow;