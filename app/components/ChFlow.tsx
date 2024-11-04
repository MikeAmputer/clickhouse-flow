'use client'

import { ChTableNodeProps } from "./ChTableNode";
import { nodeTypes, type CustomNodeType } from "../nodes";
import { useEffect } from 'react';
import dagre from '@dagrejs/dagre';

import {
    ReactFlow,
    ReactFlowProvider,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    useReactFlow,
    MiniMap,
    Controls,
    useNodesInitialized,
    MarkerType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

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
        const { inTables, outTables } = calculateTableConnections(node.table.fullName);

        return {
            id: node.table.fullName,
            type: 'ch-table',
            data: { ...node, inTables, outTables },
            style: { border: '0px solid #777', padding: 3 },
            position: { x: 0, y: 0 },
        };
    }) satisfies Node[];

    const calculateEdges = (transitions: [source: string, target: string][]): Edge[] => {
        const sourceIndexMap: Record<string, number> = {};
        const targetIndexMap: Record<string, number> = {};

        return transitions.map(([source, target], index) => {
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
                animated: false,
                style: { stroke: '#000' },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 25,
                    height: 25,
                    color: '#000',
                },
            };
        });
    };

    const [nodes, , onNodesChange] = useNodesState<CustomNodeType>(nodeArray);
    const [edges, , onEdgesChange] = useEdgesState<Edge>([]);

    const reactFlowInstance = useReactFlow();
    const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false, });

    useEffect(() => {
        if (nodesInitialized) {
            const flowNodes = reactFlowInstance.getNodes();

            var dag = new dagre.graphlib.Graph({ directed: true });
            dag.setGraph({ rankdir: 'LR', align: 'UL', nodesep: 80, ranksep: 80 });
            dag.setDefaultEdgeLabel(() => { return {}; });

            flowNodes.forEach(node => {
                const bounds = reactFlowInstance.getNodesBounds([node]);
                dag.setNode(node.id, { width: bounds.width, height: bounds.height });
            });

            transitions.forEach((edge) => {
                dag.setEdge(edge[0], edge[1]);
            });

            dagre.layout(dag);

            const transitionPriorities: Record<string, number> = {};

            dag.nodes().forEach((name) => {
                const dagNode = dag.node(name);

                const x = dagNode.x - dagNode.width / 2
                const y = dagNode.y - dagNode.height / 2;

                reactFlowInstance.updateNode(name, { position: { x, y } });

                transitionPriorities[name] = y;
            });

            const orderedTransitions = transitions
                .toSorted((a, b) => transitionPriorities[a[1]] - transitionPriorities[b[1]]);

            reactFlowInstance.setEdges(calculateEdges(orderedTransitions));
        }
    }, [nodesInitialized]);

    return (
        <ReactFlow
            id='clickhouse-dag-flow'
            style={{ background: '#e0e0dc' }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            minZoom={0.1}
            maxZoom={1}
            proOptions={{ hideAttribution: true }}
            snapGrid={[25, 25]}
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