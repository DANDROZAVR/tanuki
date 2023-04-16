import './App.css';
import Editor from '@monaco-editor/react';
import React from 'react';
import { sendScript, execScript } from './network/client.ts';
import 'reactflow/dist/style.css';

function App() {
  const [lastScriptName, setLastScriptName] = React.useState('');
  const editorRef = React.useRef<string>(null);

  function onEditorMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <div>
      <section className="form-section">
        <div id="text-editor">
          <Editor
            height="50vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            onMount={onEditorMount}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setLastScriptName(sendScript(editorRef));
            console.log(lastScriptName);
          }}
        >
          Send
        </button>
      </section>
      <section className="form-section">
        <input type="text" placeholder="script1-1-2001-1-1-1.tnk" />
        <button
          type="button"
          onClick={() => {
            execScript(lastScriptName);
          }}
        >
          Run script
        </button>
      </section>
    </div>
  );
}

export default App;
