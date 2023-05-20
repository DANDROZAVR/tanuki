import './style.css';
import 'reactflow/dist/style.css';
import React from 'react';

export function ThemeSelector({ updateEditorTheme }) {
  const [selected, setSelected] = React.useState(
    window.electron.store.get('theme')
  );

  return (
    <select
      id="theme-select"
      onChange={async (event) => {
        const tmpSelected = event.target.value;
        setSelected(tmpSelected);
        await window.theme.set(tmpSelected);
        window.electron.store.set('theme', tmpSelected);
        const darkTheme = await window.theme.get();
        updateEditorTheme(darkTheme ? 'vs-dark' : 'vs-light');
      }}
      defaultValue={selected}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

export default ThemeSelector;
