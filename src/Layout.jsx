import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase/config.jsx";

import MobileLeftNav from "./comp/navBars/MobileLeftNav";
import MobileHeader from "./comp/navBars/MobileHeader";

const Layout = ({ basketQty }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[100svh] w-[100svw] relative overflow-hidden">
      {window.location.pathname !== "/" && <MobileHeader />}

      <div className={`basis-[95%] flex bg-[--c60] z-10 relative`}>
        {window.location.pathname !== "/" && <MobileLeftNav basketQty={basketQty} />}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
