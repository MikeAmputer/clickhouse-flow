'use client'

import {
    ReactFlow,
    Node,
    Edge,
    useNodesState,
    MiniMap,
    Controls,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { ChTableNodeProps } from "./ChTableNode";
import { nodeTypes, type CustomNodeType } from "../nodes";

export type ChFlowProps = {
    tableNodes: ChTableNodeProps[];
    transitions: [source: string, target: string][];
}

const ChFlow: React.FC<ChFlowProps> = ({ tableNodes, transitions }) => {
    const calculateTableConnections = (tableName: string) => {
        const inTables = transitions.filter(([_, target]) => target === tableName).length;
        const outTables = transitions.filter(([source, _]) => source === tableName).length;
        return { inTables, outTables };
    };

    const nodeArray = tableNodes.map((node, index) => {
        const { inTables, outTables } = calculateTableConnections(node.table.name);

        return {
            id: node.table.name,
            type: 'ch-table',
            data: { table: node.table, width: node.width, height: node.height, inTables, outTables },
            style: { border: '0px solid #777', padding: 3 },
            position: { x: index * 250, y: 0 },
        };
    }) satisfies Node[];

    const sourceIndexMap: Record<string, number> = {};
    const targetIndexMap: Record<string, number> = {};

    const edgeArray = transitions.map(([source, target], index) => {
        const sourceIndex = sourceIndexMap[source] || 0;
        sourceIndexMap[source] = sourceIndex + 1;

        const targetIndex = targetIndexMap[target] || 0;
        targetIndexMap[target] = targetIndex + 1;

        return {
            id: `edge-${index}`,
            source,
            sourceHandle: `${source}-out-${sourceIndex}`,
            target,
            targetHandle: `${target}-in-${targetIndex}`,
            animated: true,
            style: { stroke: '#000' },
        };
    }) satisfies Edge[];

    const [nodes, , onNodesChange] = useNodesState<CustomNodeType>(nodeArray);

    return (
        <ReactFlow
            style={{ background: '#e0e0dc' }}
            nodes={nodes}
            edges={edgeArray}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            minZoom={0.1}
            maxZoom={1}
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