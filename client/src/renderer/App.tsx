import './gui/style.css';
import React from 'react';
import { TextEditor } from './gui/text_editor.tsx';
import { NodeEditor } from './gui/node_editor.tsx';
import { ThemeSelector } from './gui/theme_selector.tsx';
import 'reactflow/dist/style.css';

function App() {
  return (
    <>
    <div className="vertSplit">
      <div className="vertSplitCol">
        <TextEditor />
      </div>
      <div className="vertSplitCol">
        <NodeEditor />
      </div>
    </div>
    <ThemeSelector />
    </>
  );
}

export default App;
