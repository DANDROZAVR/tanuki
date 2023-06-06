import React from 'react';
import FileState from './fileState.ts';

const url = 'http://localhost:3001';

var signed_username="";
var signed_password="";

export async function sendScript(script: string, scriptName: string) {
  // TODO: tris should take name as argument
  /* establish http connection */
  const request = new XMLHttpRequest();
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
      user: signed_username,
      password: signed_password,
      title: scriptName,
      source: script,
    })
  );

  return scriptName;
}

export async function updateScript(script: string, scriptName: string) {
  // TODO: tris should take name as argument
  /* establish http connection */
  const request = new XMLHttpRequest();
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
      user: signed_username,
      password: signed_password,
      title: scriptName,
      source: script,
    })
  );

  return scriptName;
}

export async function sendOrUpdate(script: string, scriptName: string) {
  // TODO: tris should take name as argument
  /* establish http connection */
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);

      if (
        response.status === 1 &&
        response.message === 'Script with that name already exist'
      ) {
        updateScript(script, scriptName);
      } else {
        alert(response.message);
      }
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'insertScript',
      user: signed_username,
      password: signed_password,
      title: scriptName,
      source: script,
    })
  );

  return scriptName;
}

export async function execScript(scriptName: string) {
  // TODO: this should take string as argument
  /* establish http connection */
  const request = new XMLHttpRequest();
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
      user: signed_username,
      password: signed_password,
      title: scriptName,
    })
  );
}

export async function loadScript(scriptName: string, callback) {
  /* establish http connection */
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      if(response.status==0) {
        const scriptState = {
          scriptName,
          value: response.source,
          defaultLanguage: 'typescript',
        } as FileState;
        callback(scriptState);
      } else {
        alert(response.message)
      }
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'loadScript',
      user: signed_username,
      password: signed_password,
      title: scriptName,
    })
  );
}

export async function deleteScript(scriptName: string) {
  /* establish http connection */
  const request = new XMLHttpRequest();
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
      user: signed_username,
      password: signed_password,
      title: scriptName,
    })
  );
}

export async function createUser(username: string, password: string, callback) {
  /* establish http connection */
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      callback(response);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'createUser',
      user: username,
      password,
    })
  );
}

export async function logIn(username: string, password: string, callback) {
  /* establish http connection */
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      if(response.status === 0){
        signed_username = username
        signed_password = password
      }
      callback(response);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'signIn',
      user: username,
      password,
    })
  );
}

export async function logOut() {
  signed_username=""
  signed_password=""
}
