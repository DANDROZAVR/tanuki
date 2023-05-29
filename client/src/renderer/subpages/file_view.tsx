import React from 'react';
import { useLocation } from 'react-router-dom';
import { renderOptions } from 'renderer/render_options';
import TextEditor from '../gui/text_editor';

function FileViewScreen() {
  const state = useLocation();
  return (
    <TextEditor
      renderOptions={renderOptions}
      editorTheme={state.themeState}
      scriptState={state.scriptState}
    />
  );
}

export default FileViewScreen;
