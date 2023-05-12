import { React } from 'react';
import { Handle, Position } from 'reactflow';

export function ScriptLineNode({ data }) {
  return (
    <div className="nodeSurface">
      <div>
        <label htmlFor="text">
          Text:
          <input id="text" name="text" />
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="next" />
      <Handle type="target" position={Position.Left} id="prev" />
    </div>
  );
}

export function ScriptFinishNode({ data }) {
  return (
    <div className="nodeSurface">
      End
      <Handle type="target" position={Position.Left} id="prev" />
    </div>
  );
}

export function ScriptStartNode({ data }) {
  return (
    <div className="nodeSurface">
      Start
      <Handle type="source" position={Position.Right} id="next" />
    </div>
  );
}
