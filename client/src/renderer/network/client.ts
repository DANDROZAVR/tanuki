import React from 'react';
import FileState from './fileState.ts';

export async function sendScript(ref: string) {
  const script = ref.current.getValue();

  const input = document.getElementById(
    'scriptTitle'
  ) as HTMLInputElement | null;
  const scriptName = input?.value;

  /* establish http connection */
  const request = new XMLHttpRequest();
  // TODO: custom server address
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      // TODO: if response.status = 'error' make alert appear accordingly
      // eslint-disable-next-line no-alert
      alert(response.message);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'insertScript',
      user: 'admin',
      title: scriptName,
      source: script,
    })
  );

  return scriptName;
}

export async function execScript() {
  const input = document.getElementById(
    'scriptToRun'
  ) as HTMLInputElement | null;
  const scriptName = input?.value;

  /* establish http connection */
  const request = new XMLHttpRequest();
  // TODO: custom server address
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      // eslint-disable-next-line no-alert
      alert(response.message);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'execScript',
      user: 'admin',
      title: scriptName,
    })
  );
}

export async function loadScript(
  setScriptState: React.Dispatch<React.SetStateAction>
) {
  const input = document.getElementById(
    'scriptToLoad'
  ) as HTMLInputElement | null;
  const scriptName = input?.value;

  /* establish http connection */
  const request = new XMLHttpRequest();
  // TODO: custom server address
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      // eslint-disable-next-line no-alert
      alert(response.message);
      setScriptState({
        name: scriptName,
        value: response.source,
        defaultLanguage: 'typescript',
      } as FileState);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'loadScript',
      user: 'admin',
      title: scriptName,
    })
  );
}
