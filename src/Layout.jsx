import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase/config.jsx";

import MobileFooter from "./comp/navBars/MobileFooter";
import MobileHeader from "./comp/navBars/MobileHeader";

const Layout = ({ basketQty }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[100svh] relative">
      { window.location.pathname !== "/" && <MobileHeader /> }
      <Outlet />
      { window.location.pathname !== "/" && <MobileFooter basketQty={basketQty} /> }
    </div>
  );
};

export default Layout;
