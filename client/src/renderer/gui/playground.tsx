import React from 'react';
import { renderOptions } from 'renderer/render_options';
import NodeEditor from './node_editor';
import TextEditor from './text_editor';
import ThemeSelector from './theme_selector';

function Playground() {
  const [editorTheme, setEditorTheme] = React.useState(
    window.theme.get() ? 'vs-dark' : 'vs-light'
  );

  return (
    <div className="vertSplit">
      <div className="vertSplitCol">
        <TextEditor
          renderOptions={renderOptions}
          editorTheme={editorTheme}
          scriptState={scriptState}
        />
      </div>
      <div className="vertSplitCol">
        <NodeEditor />
      </div>
    </div>
  );
}

export default Playground;
