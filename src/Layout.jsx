import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

import MobileFooter from "./comp/navBars/MobileFooter";
import MobileHeader from "./comp/navBars/MobileHeader";

const Layout = ({ basketQty }) => {
  const [user, loading, error] = useAuthState(auth);
  const nav = useNavigate();

  useEffect(() => {
    user ? nav("/menu") : nav("/auth")
  }, [user]);

  return (
    <div className="flex flex-col justify-center h-[100svh] relative">
      {user && <MobileHeader/>}
      <Outlet />
      {user && <MobileFooter/>}
    </div>
  );
};

export default Layout;
