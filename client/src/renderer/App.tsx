import './gui/style.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Playground from './gui/playground';
import Layout from './subpages/layout';
import LogInScreen from './subpages/login';
import SignInScreen from './subpages/signin';
import ScriptManagerScreen from './subpages/script_manager';
import FileViewScreen from './subpages/file_view';
import PickServerScreen from './subpages/server_picker.tsx';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PickServerScreen />} />
          <Route path="login" element={<LogInScreen />} />
          <Route path="signin" element={<SignInScreen />} />
          <Route path="home" element={<ScriptManagerScreen />} />
          <Route path="playground" element={<Playground />} />
          <Route path="file_view" element={<FileViewScreen />} />
          <Route path="pick_server" element={<PickServerScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
