import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { pickServer } from '../network/client.ts';
import ThemeSelector from '../gui/theme_selector';

export function PickServerScreen() {
  const navigate = useNavigate();
  const [serverUrl, setServerUrl] = React.useState('http://localhost:3001');

  function onSubmit(e) {
    e.preventDefault();
    pickServer(serverUrl);
    navigate('/login');
  }

  return (
    <div className="formContainer">
      <form onSubmit={onSubmit} className="credentialsForm">
        <label htmlFor="server_url">
          Server address:
          <input
            className="credentialsInput"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            type="text"
            placeholder="Server URL"
            id="server_url"
            name="server_url"
          />
        </label>
        <button type="submit">Choose server</button>
      </form>
      <label>
        Choose theme:
        <ThemeSelector
          updateEditorTheme={(val: string) => {}}
        />
      </label>
    </div>
  );
}

export default PickServerScreen;
