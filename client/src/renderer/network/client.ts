export function sendScript(ref: string) {
  const script = ref.current.getValue();
  const timestamp = new Date();
  const scriptName = `script${timestamp.getDay()}-${timestamp.getMonth()}-${timestamp.getFullYear()}-${timestamp.getHours()}-${timestamp.getMinutes()}-${timestamp.getSeconds()}.tnk`;

  /* establish http connection */
  const connection = new XMLHttpRequest();
  // TODO: custom server address
  const url = 'http://localhost:3001';
  connection.open('POST', url, true);
  connection.onreadystatechange = function onStateChange() {
    if (connection.readyState === 4 && connection.status === 200) {
      alert(`Sent script with name ${scriptName}`);
    }
  };
  connection.setRequestHeader('Content-type', 'application/json');
  connection.send(
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
  const connection = new XMLHttpRequest();
  // TODO: custom server address
  const url = 'http://localhost:3001';
  connection.open('POST', url, true);
  connection.onreadystatechange = function onStateChange() {
    if (connection.readyState === 4 && connection.status === 200) {
      alert(`Run script ${scriptName}`);
    }
  };
  connection.setRequestHeader('Content-type', 'application/json');
  connection.send(
    JSON.stringify({
      type: 'execScript',
      user: 'admin',
      title: scriptName,
    })
  );
}
