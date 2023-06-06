import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { renderOptions } from 'renderer/render_options';
import TextEditor from '../gui/text_editor';

function FileViewScreen() {
  const state = useLocation();
  const navigate = useNavigate();
  function goBack() {
    navigate('/script_manager');
  }
  return (
    <div>
      <TextEditor
        renderOptions={renderOptions}
        editorTheme={state.themeState}
        scriptState={state.scriptState}
      />
      <button type="button" onClick={goBack}>
        Go back
      </button>
    </div>
  );
}

export default FileViewScreen;
