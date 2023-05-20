import './style.css';
import React from 'react';
import Editor from '@monaco-editor/react';
import { sendScript, execScript, loadScript } from '../network/client.ts';
import 'reactflow/dist/style.css';
import { RenderOptions } from '@testing-library/react';
import { Script } from 'renderer/script';
import { Options } from 'renderer/render_options';

function FunctionButton({id, text, on_click} : {id:string, text:string, on_click:any}) {
  return (<section className="form-section">
        <input id={id} type="text" placeholder="my_script.tnk" />
        <button type="button" onClick={on_click}>
          {text}
        </button>
      </section>);
}


const initialScript: Script = {
  name: "script.tnk",
  lines: [],
};


export function TextEditor({renderOptions, editorTheme} : {renderOptions: Options, editorTheme: string } ) {
  const editorRef = React.useRef<string>(null);
  // eslint-disable-next-line no-unused-vars
  function onEditorMount(editor, monaco) {
    editorRef.current = editor;
  }

  function CodeSection() {
    return (<section className="form-section">
          <div id="text-editor">
            <Editor
              value={initialScript.lines.reduce((res,cur) => res + '\n' + cur, '')}
              height="50vh"
              theme={editorTheme}
              defaultLanguage={renderOptions.defaultLanguage}
              // eslint-disable-next-line react/jsx-no-bind
              onMount={onEditorMount}
            />
          </div>
        </section>);
  }

  return (
    <div>
      <CodeSection/>
      <FunctionButton id="scriptTitle" text="Send" on_click = {() => {sendScript(editorRef);}}/>
      <FunctionButton id="scriptToRun" text="Run script" on_click = {() => {execScript()}}/>
      {/* <FunctionButton id="scriptToLoad" text="Load script" on_click = {() => loadScript(setScriptState)}/> */}
    </div>
  );
}

export default TextEditor;
