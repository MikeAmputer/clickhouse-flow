'use client'

import {
    ReactFlow,
    ReactFlowProvider,
    Node,
    Edge,
    useNodesState,
    useReactFlow,
    MiniMap,
    Controls,
    useNodesInitialized,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { ChTableNodeProps } from "./ChTableNode";
import { nodeTypes, type CustomNodeType } from "../nodes";
import { useEffect } from 'react';
import dagre from '@dagrejs/dagre';

export type ChFlowProps = {
    tableNodes: ChTableNodeProps[];
    transitions: [source: string, target: string][];
};

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
            data: { ...node, inTables, outTables },
            style: { border: '0px solid #777', padding: 3 },
            position: { x: 0, y: 0 },
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

    const reactFlowInstance = useReactFlow();
    const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false, });

    useEffect(() => {
        if (nodesInitialized) {
            const nodes = reactFlowInstance.getNodes();

            var dag = new dagre.graphlib.Graph({ directed: true });
            dag.setGraph({ rankdir: 'LR', align: 'UL', nodesep: 100, ranksep: 100 });
            dag.setDefaultEdgeLabel(() => { return {}; });

            nodes.forEach(node => {
                const bounds = reactFlowInstance.getNodesBounds([node]);
                dag.setNode(node.id, { width: bounds.width, height: bounds.height });
            });

            transitions.forEach((edge) => {
                dag.setEdge(edge[0], edge[1]);
            });

            dagre.layout(dag);

            dag.nodes().forEach((name) => {
                const dagNode = dag.node(name);
                reactFlowInstance.updateNode(
                    name,
                    {
                        position: {
                            x: dagNode.x - dagNode.width / 2,
                            y: dagNode.y - dagNode.height / 2
                        }
                    });
            });
        }
    }, [nodesInitialized]);

    return (
        <ReactFlow
            id='clickhouse-dag-flow'
            style={{ background: '#e0e0dc' }}
            nodes={nodes}
            edges={edgeArray}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            minZoom={0.1}
            maxZoom={1}
            proOptions={{ hideAttribution: true }}
            snapGrid={[50, 50]}
            snapToGrid={true}
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

const ChFlowProvider: React.FC<ChFlowProps> = ({ tableNodes, transitions }) => {
    return (
        <ReactFlowProvider>
            <ChFlow
                tableNodes={tableNodes}
                transitions={transitions}
            />
        </ReactFlowProvider>
    );
};

export default ChFlowProvider;