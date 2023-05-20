import React from 'react';
import { renderOptions } from 'renderer/render_options';
import NodeEditor from './node_editor';
import TextEditor from './text_editor';
import ThemeSelector from './theme_selector';

function MainWindow() {
  const [editorTheme, setEditorTheme] = React.useState(
    window.theme.get() ? 'vs-dark' : 'vs-light'
  );

  function updateEditorTheme(themeName: string) {
    setEditorTheme(themeName);
  }
  return (
    <>
      <div className="vertSplit">
        <div className="vertSplitCol">
          <TextEditor renderOptions={renderOptions} editorTheme={editorTheme} />
        </div>
        <div className="vertSplitCol">
          <NodeEditor />
        </div>
      </div>
      <ThemeSelector
        updateEditorTheme={(name: string) => updateEditorTheme(name)}
      />
    </>
  );
}

export default MainWindow;
