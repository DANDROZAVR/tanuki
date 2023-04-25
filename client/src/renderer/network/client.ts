export function sendScript(ref: string) {
  const script = ref.current.getValue();
  const timestamp = new Date();

  const input = document.getElementById("scriptTitle") as HTMLInputElement | null;
  const scriptName = input?.value;

  /* establish http connection */
  const request = new XMLHttpRequest();
  // TODO: custom server address
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      let response = JSON.parse(request.response)
      // TODO: if response.status = 'error' make alert appear accordingly
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

export function execScript() {

  const input = document.getElementById("scriptToRun") as HTMLInputElement | null;
  const scriptName = input?.value;

  /* establish http connection */
  const request = new XMLHttpRequest();
  // TODO: custom server address
  const url = 'http://localhost:3001';
  request.open('POST', url, true);
  request.onreadystatechange = function onStateChange() {
    if (request.readyState === 4 && request.status === 200) {
      let response = JSON.parse(request.response)
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
