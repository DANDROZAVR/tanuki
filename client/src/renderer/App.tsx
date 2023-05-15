import './gui/style.css';
import React from 'react';
import { TextEditor } from './gui/text_editor.tsx';
import { NodeEditor } from './gui/node_editor.tsx';
import { ThemeSelector } from './gui/theme_selector.tsx';
import 'reactflow/dist/style.css';
import MainWindow from './gui/main_window';

function App() {
  return (<MainWindow />);
}

export default App;
