import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ScriptLineNode, ScriptStartNode, ScriptFinishNode } from './nodes.tsx';

const initialEdges = [];

/* function traverse(linesStates: string[], item: Node) {
  let curr: Node = item;
  [curr] = getOutgoers(curr);
  let res: string = '';
  while (getOutgoers(curr).length < 1) {
    res += linesStates[curr.id];
    [curr] = getOutgoers(curr);
  }
  console.log(res);
} */

export function NodeEditor() {
  const nodeTypes = React.useMemo(
    () => ({
      scriptLine: ScriptLineNode,
      scriptStart: ScriptStartNode,
      scriptFinish: ScriptFinishNode,
    }),
    []
  );
  const initialNodes = [
    {
      id: 'node-1',
      type: 'ScriptLineNode',
      position: { x: 0, y: 0 },
      data: { value: 123 },
    },
  ];

  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);

  const onNodesChange = React.useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = React.useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = React.useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="flowContainer">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#444" variant="cross" />
        <Controls className="darkButton" />
      </ReactFlow>
    </div>
  );
}

export default NodeEditor;
