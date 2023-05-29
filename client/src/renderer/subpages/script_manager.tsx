import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RequestFieldAndButton } from '../gui/util';
import { loadScript } from '../network/client';

export function ScriptManagerScreen() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState('');

  function onLoadScript(scriptName: string) {
    console.log('loadscript');
    loadScript(scriptName, (scriptState) => {
      navigate('/file_view', {
        scriptState,
        themeState: window.theme.get(),
      });
    });
  }

  function goToPlayground() {
    navigate('/playground');
  }

  return (
    <div className="formContainer">
      <section className="form-section">
        <RequestFieldAndButton
          id="loadScript"
          placeholder="script.tnk"
          buttonText="Load script"
          callback={(str) => onLoadScript(str)}
        />
      </section>
      <button type="button" onClick={goToPlayground}>
        Go to playground
      </button>
      <span className="red">{errorMessage}</span>
      <Link to="/login">Log out</Link>
    </div>
  );
}

export default ScriptManagerScreen;
