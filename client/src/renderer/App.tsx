import './App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import React from 'react';
import sendScript from './network/client.ts';
import 'reactflow/dist/style.css';
import icon from '../../assets/icon.svg';

function App() {
  const [lastScriptName, setLastScriptName] = React.useState('');
  const editorRef = React.useRef<string>(null);

  function onEditorMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <div>
      <div className="container">
        <div id="text-editor">
          <Editor
            height="50vh"
            theme="vs-dark"
            defaultLanguage="javascript"
            onMount={onEditorMount}
          />
        </div>
      </div>
      <div className="container">
        <button
          type="button"
          onClick={() => {
            setLastScriptName(sendScript(editorRef));
            console.log(lastScriptName);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

/*
function Hello() {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
*/

export default App;
