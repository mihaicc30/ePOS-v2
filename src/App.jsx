import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "./firebase/config.jsx";

import {
  Routes,
  Route,
  Outlet,
  NavLink,
  BrowserRouter,
} from "react-router-dom";


import Layout from "./Layout";

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/auth" element={<p>Route "/auth" </p>} />
          <Route path="/menu" element={<p>Route "/menu" </p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
