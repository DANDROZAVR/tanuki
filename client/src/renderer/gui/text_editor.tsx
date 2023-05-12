import './style.css';
import React from 'react';
import Editor from '@monaco-editor/react';
import { sendScript, execScript, loadScript } from '../network/client.ts';
import { startupFile } from '../fileState.ts';
import 'reactflow/dist/style.css';

export function TextEditor() {
  const [scriptState, setScriptState] = React.useState(startupFile);
  const editorRef = React.useRef<string>(null);
  // eslint-disable-next-line no-unused-vars
  function onEditorMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <div>
      <section className="form-section">
        <div id="text-editor">
          <Editor
            value={scriptState.value}
            height="50vh"
            theme="vs-dark"
            defaultLanguage={scriptState.defaultLanguage}
            // eslint-disable-next-line react/jsx-no-bind
            onMount={onEditorMount}
          />
        </div>
        <input id="scriptTitle" type="text" placeholder="my_script.tnk" />
        <button
          type="button"
          onClick={() => {
            sendScript(editorRef);
          }}
        >
          Send
        </button>
      </section>
      <section className="form-section">
        <input id="scriptToRun" type="text" placeholder="my_script.tnk" />
        <button
          type="button"
          onClick={() => {
            execScript();
          }}
        >
          Run script
        </button>
      </section>
      <section className="form-section">
        <input id="scriptToLoad" type="text" placeholder="my_script.tnk" />
        <button
          type="button"
          onClick={() => {
            loadScript(setScriptState);
          }}
        >
          Load script
        </button>
      </section>
    </div>
  );
}

export default TextEditor;
