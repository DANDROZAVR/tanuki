import './gui/style.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Playground from './gui/playground';
import Layout from './subpages/layout';
import LogInScreen from './subpages/login';
import SignInScreen from './subpages/signin';
import ScriptManagerScreen from './subpages/script_manager';
import FileViewScreen from './subpages/file_view';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LogInScreen />} />
          <Route path="login" element={<LogInScreen />} />
          <Route path="signin" element={<SignInScreen />} />
          <Route path="home" element={<ScriptManagerScreen />} />
          <Route path="playground" element={<Playground />} />
          <Route path="file_view" element={<FileViewScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
