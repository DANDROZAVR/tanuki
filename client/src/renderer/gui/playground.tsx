import React from 'react';
import { renderOptions } from 'renderer/render_options';
import NodeEditor from './node_editor';
import TextEditor from './text_editor';
import ThemeSelector from './theme_selector';
import {useLocation, useNavigate} from "react-router-dom";


function Playground() {
  const [editorTheme, setEditorTheme] = React.useState(
    window.theme.get() ? 'vs-dark' : 'vs-light'
  );
  const navigate = useNavigate();
  function goBack() {
    navigate('/script_manager');
  }

  return (
    <div>
      <div className="vertSplit">
        <div className="vertSplitCol">
          <TextEditor
            renderOptions={renderOptions}
            editorTheme={editorTheme}
            scriptState={""}
          />
        </div>
        <div className="vertSplitCol">
          <NodeEditor />
        </div>
      </div>
      <button type="button" onClick={goBack}>
        Go back
      </button>
    </div>
  );
}

export default Playground;
