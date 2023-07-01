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

import Auth from "./comp/auth/Auth";
import Menu from "./comp/menu/Menu";

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>} >
          <Route path="/auth" element={<Auth/>} />
          <Route path="/menu" element={<Menu/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
