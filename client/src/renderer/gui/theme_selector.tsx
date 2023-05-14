import './style.css';
import React from 'react';
import Editor from '@monaco-editor/react';
import { sendScript, execScript, loadScript } from '../network/client.ts';
import { startupFile } from '../fileState.ts';
import 'reactflow/dist/style.css';

export function ThemeSelector() {

  return (
    <select id="pet-select" onChange= {
      async(event) => {
        const selected = event.target.value;
        await window.theme.set(selected);
      }
    }>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

export default ThemeSelector;
