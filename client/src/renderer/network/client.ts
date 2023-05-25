import React from 'react';
import FileState from './fileState.ts';

export async function sendScript(script: string, scriptName:string) { // TODO: tris should take name as argument
  /* establish http connection */
  const request = new XMLHttpRequest();
  // TODO: custom server address
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      // TODO: if response.status !=0 make alert appear accordingly

      alert(response.message);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'insertScript',
      user: 'admin',
      password: 'admin',
      title: scriptName,
      source: script,
    })
  );

  return scriptName;
}

export async function updateScript(script: string, scriptName:string) { // TODO: tris should take name as argument
  /* establish http connection */
  const request = new XMLHttpRequest();
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);

      alert(response.message);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'updateScript',
      user: 'admin',
      password: 'admin',
      title: scriptName,
      source: script,
    })
  );

  return scriptName;
}

export async function sendOrUpdate(script: string, scriptName:string) { // TODO: tris should take name as argument
  /* establish http connection */
  const request = new XMLHttpRequest();
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);

      if(response.status == 1 && response.message =="Script with that name already exist"){
        updateScript(script, scriptName)
      } else {
        alert(response.message);
      }
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'insertScript',
      user: 'admin',
      password: 'admin',
      title: scriptName,
      source: script,
    })
  );

  return scriptName;
}

export async function execScript(scriptName: string) { // TODO: this should take string as argument
  /* establish http connection */
  const request = new XMLHttpRequest();
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);

      alert(response.message);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'execScript',
      user: 'admin',
      password: 'admin',
      title: scriptName,
    })
  );
}

export async function loadScript(
  scriptName: string,
  setScriptState: React.Dispatch<React.SetStateAction>
) {
  /* establish http connection */
  const request = new XMLHttpRequest();
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);

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
      password: 'admin',
      title: scriptName,
    })
  );
}

export async function deleteScript(scriptName: string) {
  /* establish http connection */
  const request = new XMLHttpRequest();
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);

      alert(response.message);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'deleteScript',
      user: 'admin',
      password: 'admin',
      title: scriptName,
    })
  );
}

export async function createUser(userName: string, password:string) {
  /* establish http connection */
  const request = new XMLHttpRequest();
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);

      alert(response.message);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'createUser',
      username: userName,
      password: password
    })
  );
}

export async function signIn(userName: string, password:string) {
  /* establish http connection */
  const request = new XMLHttpRequest();
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      if(response.status==0){
        //username and password is correct
      }

      alert(response.message);
    }
  }
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'signIn',
      username: userName,
      password: password
    })
  );
}
