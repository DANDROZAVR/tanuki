import './style.css';
import React from 'react';
import Editor from '@monaco-editor/react';
import { sendScript, execScript, loadScript, scheduleScript } from '../network/client.ts';
import 'reactflow/dist/style.css';
import { RenderOptions } from '@testing-library/react';
import { Script } from 'renderer/script';
import { Options } from 'renderer/render_options';
import { FunctionButton } from './util';
import { scheduler } from 'timers/promises';

const initialScript: Script = {
  name: "script",
  lines: [],
};


export function TextEditor({renderOptions, editorTheme, scriptState}: {renderOptions: Options, editorTheme: string, scriptState: FileState}) {
  const editorRef = React.useRef<string>(null);
  // eslint-disable-next-line no-unused-vars
  function onEditorMount(editor, monaco) {
    console.log(editorRef.value)
    editorRef.current = editor;
  }

  console.log(scriptState);
  function CodeSection() {
    return (<section className="form-section">
          <div id="text-editor">
            <Editor
              //value={initialScript.lines.reduce((res,cur) => res + '\n' + cur, '')}
              value = {scriptState.value}
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
      <section className="form-section">
        <input id="scheduleTitle" type="text" placeholder="my_script" />
        <input id="scheduleTime" type="text" placeholder={new Date().toLocaleString()}/>
        <button type="button" onClick={() => {
          const title = document.getElementById('scheduleTitle') as HTMLInputElement | null;
          const time = document.getElementById('scheduleTime') as HTMLInputElement | null;
          console.log(new Date('12.06.2023, 09:49:38'));
          scheduleScript(title?.value, time?.value);
        }}>
          Schedule
        </button>
      </section>
    </div>
  );
}

export default TextEditor;
