import FileState from './fileState.ts';

let url = 'http://localhost:3001';

let signedUsername = '';
let signedPassword = '';
let currentDir = '';

export function getCurrentDirectory() {
  return currentDir;
}

export interface DirInfo {
  name: string;
  description: string;
  isDirectory: boolean;
}

async function sendRequest(message: string, callback) {
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      const response = JSON.parse(request.response);
      callback(response);
      //alert(response.message);
    }
  };
  request.setRequestHeader('Content-type', 'application/json');
  request.send(message);
}

export async function sendScript(
  script: string,
  scriptName: string,
  description = ''
) {
  sendRequest(
    JSON.stringify({
      type: 'insertScript',
      user: signedUsername,
      password: signedPassword,
      title: scriptName,
      source: script,
      currentDir,
      description,
    }),
    (response) => {}
  );
  return scriptName;
}

export async function updateScript(
  script: string,
  scriptName: string,
  description = ''
) {
  sendRequest(
    JSON.stringify({
      type: 'updateScript',
      user: signedUsername,
      password: signedPassword,
      path: currentDir + scriptName,
      description,
      source: script,
    }),
    (response) => {}
  );
  return scriptName;
}

export async function sendOrUpdate(
  script: string,
  scriptName: string,
  description = ''
) {
  sendRequest(
    JSON.stringify({
      type: 'insertScript',
      user: signedUsername,
      password: signedPassword,
      title: scriptName,
      source: script,
      currentDir,
      description,
    }),
    (response) => {
      if (
        response.status === 1 &&
        response.message === 'Script with that name already exist'
      ) {
        updateScript(script, scriptName, description);
      }
    }
  );
  return scriptName;
}

export async function execScript(scriptName: string) {
  sendRequest(
    JSON.stringify({
      type: 'execScript',
      user: signedUsername,
      password: signedPassword,
      path: currentDir + scriptName,
    }),
    (response) => {}
  );
}

export async function loadScript(
  dirInfo: DirInfo,
  scriptCallback,
  directoryCallback
) {
  if (dirInfo.isDirectory) {
    const newPath = `${currentDir}${dirInfo.name}/`;
    sendRequest(
      JSON.stringify({
        type: 'loadDirectory',
        user: signedUsername,
        password: signedPassword,
        path: newPath,
      }),
      (response) => {
        if (response.status === 0) {
          currentDir = newPath;
          directoryCallback(response.contents);
        }
      }
    );
  } else {
    sendRequest(
      JSON.stringify({
        type: 'loadScript',
        user: signedUsername,
        password: signedPassword,
        path: currentDir + dirInfo.name,
      }),
      (response) => {
        if (response.status === 0) {
          const scriptState = {
            scriptName: dirInfo.name,
            value: response.message.source,
            defaultLanguage: 'typescript',
          } as FileState;
          scriptCallback(scriptState);
        } else {
          alert(response.message);
        }
      }
    );
  }
}

async function loadCurrentDirectory(callback) {
  sendRequest(
    JSON.stringify({
      type: 'loadDirectory',
      user: signedUsername,
      password: signedPassword,
      path: currentDir,
    }),
    (response) => {
      if (response.status === 0) {
        // in response.contents we get array of dirInfo - contents of chosen directory
        const contents = response.contents as DirInfo[];
        callback(contents);
      }
    }
  );
}

export async function loadParentDirectory(callback) {
  sendRequest(
    JSON.stringify({
      type: 'getParent',
      user: signedUsername,
      password: signedPassword,
      path: currentDir,
    }),
    (response) => {
      if (response.status === 0) {
        currentDir = response.path;
        loadCurrentDirectory(callback);
      }
    }
  );
}

export async function loadHomeDirectory(callback) {
  currentDir = `${signedUsername}/`;
  loadCurrentDirectory(callback);
}

export async function createDirectory(name: string, description = '') {
  sendRequest(
    JSON.stringify({
      type: 'createDirectory',
      user: signedUsername,
      password: signedPassword,
      name,
      currentDir,
      description,
    }),
    (response) => {}
  );
}

export async function deleteScript(dirInfo: DirInfo) {
  sendRequest(
    JSON.stringify({
      type: 'deleteScript',
      user: signedUsername,
      password: signedPassword,
      path: currentDir + dirInfo.name + (dirInfo.isDirectory ? '/' : ''),
    }),
    (response) => {}
  );
}

export async function createUser(username: string, password: string, callback) {
  sendRequest(
    JSON.stringify({
      type: 'createUser',
      user: username,
      password,
    }),
    callback
  );
}

export async function logIn(username: string, password: string, callback) {
  sendRequest(
    JSON.stringify({
      type: 'signIn',
      user: username,
      password,
    }),
    (response) => {
      if (response.status === 0) {
        signedUsername = username;
        signedPassword = password;
        currentDir = `${username}/`;
      }
      callback(response);
    }
  );
}

export async function scheduleScript(scriptName: string, scheduleTime: string) {
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
      type: 'scheduleScript',
      user: signedUsername,
      password: signedPassword,
      path: currentDir + scriptName,
      scheduleOptions: {
        tag: 'once',
        once: {
          date: scheduleTime,
        },
      },
    })
  );
}

export async function logOut() {
  signedUsername = '';
  signedPassword = '';
}

export async function pickServer(serverUrl: string) {
  url = serverUrl;
}
