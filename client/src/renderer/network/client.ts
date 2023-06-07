import React from 'react';
import FileState from './fileState.ts';

const url = 'http://localhost:3001';

let signed_username="";
let signed_password="";
let currentDir="";

export function getCurrentDirectory(){
  return currentDir
}

export interface DirInfo{
  name: string,
  description: string,
  isDirectory: boolean
}

export async function sendScript(script: string, scriptName: string, description = "") {
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
      currentDir,
      description
    })
  );

  return scriptName;
}

export async function updateScript(script: string, scriptName: string, description="") {
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
      path: currentDir + scriptName,
      description,
      source: script,
    })
  );

  return scriptName;
}

export async function sendOrUpdate(script: string, scriptName: string, description="") {
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
        updateScript(script, scriptName, description);
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
      currentDir,
      description
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
      path: currentDir+scriptName,
    })
  );
}

export async function loadScript(dirInfo: DirInfo, scriptCallback, directoryCallback) {
  /* establish http connection */
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  if(dirInfo.isDirectory){
    request.onreadystatechange = function onStateChange() {
      if (request.readyState === 4 && request.status === 200) {
        const response = JSON.parse(request.response);
        if(response.status==0) {
          currentDir = currentDir + dirInfo.name + "/"
          //in response.contents we get array of dirInfo - contents of chosen directory
          directoryCallback(response.contents)
        } else {
          alert(response.message)
        }
      }
    };
    request.setRequestHeader('Content-type', 'application/json');
    request.send(
      JSON.stringify({
        type: 'loadDirectory',
        user: signed_username,
        password: signed_password,
        path: currentDir + dirInfo.name + "/",
      })
    );
  } else {
    request.onreadystatechange = function onStateChange() {
      if (request.readyState === 4 && request.status === 200) {
        const response = JSON.parse(request.response);
        if(response.status==0) {
          const scriptState = {
            scriptName : dirInfo.name,
            value: response.source,
            defaultLanguage: 'typescript',
          } as FileState;
          scriptCallback(scriptState);
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
        path: currentDir + dirInfo.name,
      })
    );
  }
}

async function loadCurrentDirectory(callback){
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      if(response.status==0) {
        //in response.contents we get array of dirInfo - contents of chosen directory
        callback(response.contents)
      } else {
        alert(response.message)
      }
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'loadDirectory',
      user: signed_username,
      password: signed_password,
      path: currentDir
    })
  );
}
export async function loadParentDirectory(callback){
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      if(response.status==0) {
        currentDir = response.path
        //in response.contents we get array of dirInfo - contents of chosen directory
        loadCurrentDirectory(callback)
      } else {
        alert(response.message)
      }
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(
    JSON.stringify({
      type: 'getParent',
      user: signed_username,
      password: signed_password,
      path: currentDir
    })
  );
}

export async function loadHomeDirectory(callback){
  currentDir = signed_username + "/"
  loadCurrentDirectory(callback)
}

export async function createDirectory(name: string, description = ""){
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
      type: 'createDirectory',
      user: signed_username,
      password: signed_password,
      name,
      currentDir,
      description
    })
  );
}

export async function deleteScript(dirInfo : DirInfo) {
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
      path: currentDir + dirInfo.name + (dirInfo.isDirectory ? "/" : ""),
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
      console.log(response)
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
