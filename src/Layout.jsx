import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import MobileLeftNav from "./comp/navBars/MobileLeftNav";
import MobileHeader from "./comp/navBars/MobileHeader";

const Layout = ({ basketQty }) => {
  return (
    <div className="flex flex-col h-[100svh] w-[100svw] relative">
      {window.location.pathname !== "/" && <MobileHeader />}
      <div className="flex grow">
        {window.location.pathname !== "/" && <MobileLeftNav basketQty={basketQty} />}
        <div className={`basis-[80%] flex flex-col bg-[--c60] z-10 relative`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
