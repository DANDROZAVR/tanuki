import './style.css';
import React from 'react';
import Editor from '@monaco-editor/react';
import { sendScript, execScript, loadScript } from '../network/client.ts';
import 'reactflow/dist/style.css';
import { RenderOptions } from '@testing-library/react';
import { Script } from 'renderer/script';
import { Options } from 'renderer/render_options';
import { FunctionButton } from './util';

const initialScript: Script = {
  name: "script.tnk",
  lines: [],
};


export function TextEditor({renderOptions, editorTheme, scriptState} : {renderOptions: Options, editorTheme: string } ) {
  console.log(scriptState.scriptName);
  const editorRef = React.useRef<string>(null);
  // eslint-disable-next-line no-unused-vars
  function onEditorMount(editor, monaco) {
    console.log(editorRef.value)
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
      <FunctionButton id="scriptTitle" text="Send" on_click = {() => {
        const input = document.getElementById('scriptTitle') as HTMLInputElement | null;
        sendScript(editorRef.current.getValue(), input?.value);
        }}/>
      <FunctionButton id="scriptToRun" text="Run script" on_click = {() => {
        const input = document.getElementById('scriptToRun') as HTMLInputElement | null;
        execScript(input?.value);
      }}/>
    </div>
  );
}

export default TextEditor;
