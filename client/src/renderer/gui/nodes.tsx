import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';

export function ScriptLineNode({ data }) {
  const [line, setLine] = useState('')
  const onChange = useCallback((evt) => { // TODO: this is dirty atm, this should use setNodes from node_editor or smth
    console.log(evt.target.value);
    data.line = evt.target.value;
  }, []);
  return (
    <div className="nodeSurface">
      <div>
        <label htmlFor="text">
          Text:
          <input id="text" name="text" onChange={e => {onChange(e); setLine(e.target.value)}} value={line}/>
        </label>
      </div>
      <Handle type="source" position={Position.Bottom} id="next" />
      <Handle type="target" position={Position.Top} id="prev" />
    </div>
  );
}

export function ScriptFinishNode({ data }) {
  return (
    <div className="nodeSurface">
      End
      <Handle type="target" position={Position.Top} id="prev" />
    </div>
  );
}

export function ScriptStartNode({ data }) {
  return (
    <div className="nodeSurface">
      Start
      <Handle type="source" position={Position.Bottom} id="next" />
    </div>
  );
}
