import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logIn } from '../network/client.ts';
import ThemeSelector from '../gui/theme_selector';

export function LogInScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  function onSubmit(e) {
    e.preventDefault();
    logIn(username, password, response => {
      if (response.status !== 0) {
        setErrorMessage('Error: ' + response.message);
      } else {
        navigate('/home');
      }
    });
  }

  return (
    <div className="formContainer">
      <form onSubmit={onSubmit} className="credentialsForm">
        <label htmlFor="username">
          Username:
          <input
            className="credentialsInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            id="username"
            name="username"
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            className="credentialsInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            id="password"
            name="password"
          />
        </label>
        <span className="red">{errorMessage}</span>
        <button type="submit">Log in</button>
      </form>
      <Link to="/signin">Doesn&apos;t have an account? Create it here.</Link>
      <label>
        Choose theme:
        <ThemeSelector
          updateEditorTheme={(val: string) => {}}
        />
      </label>
    </div>
  );
}

export default LogInScreen;
