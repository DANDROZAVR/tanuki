import './style.css';
import React from 'react';
import Editor from '@monaco-editor/react';
import { sendScript, execScript, loadScript } from '../network/client.ts';
import { startupFile } from '../fileState.ts';
import 'reactflow/dist/style.css';

export function ThemeSelector(name: string) {
  const [selected, setSelected] = React.useState(window.electron.store.get('theme'));

  return (
    <select id="theme-select" onChange= {
      async(event) => {
        const tmpSelected = event.target.value;
        setSelected(tmpSelected);
        await window.theme.set(tmpSelected);
        window.electron.store.set('theme', tmpSelected)
      }
    }
      defaultValue={ selected }
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

export default ThemeSelector;
