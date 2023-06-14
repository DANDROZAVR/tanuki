import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../network/client.ts';
import ThemeSelector from '../gui/theme_selector';

export function SignInScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  function onSubmit(e) {
    e.preventDefault();
    createUser(username, password, response => {
      if (response.status !== 0) {
        setErrorMessage("Error: " + response.message);
      } else {
        navigate('/login');
      }
    });
  }

  return (
    <div className="formContainer">
      <form onSubmit={onSubmit} className="credentialsForm">
        <label htmlFor="username">
          Username:
          <input
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            id="password"
            name="password"
          />
        </label>
        <span className="red">{errorMessage}</span>
        <button type="submit">Sign in</button>
      </form>
      <Link to="/login">Already have an account? Log in here.</Link>
      <Link to="/pick_server">Pick another server.</Link>
      <label>
        Choose theme:
        <ThemeSelector
          updateEditorTheme={(val: string) => {}}
        />
      </label>
    </div>
  );
}

export default SignInScreen;
