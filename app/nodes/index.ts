import type { BuiltInNode, NodeTypes } from "@xyflow/react";
import ChTableNode, { type ChTableNode as ChTableNodeType } from "../components/ChTableNode";

export const nodeTypes = {
    "ch-table": ChTableNode,
} satisfies NodeTypes;

export type CustomNodeType = BuiltInNode | ChTableNodeType;