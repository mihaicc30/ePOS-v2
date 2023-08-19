import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import MobileLeftNav from "./comp/navBars/MobileLeftNav";

const Layout = ({ lefty, setLefty, weeklyForecast, setWeeklyForecast, weeklyholiday, weeklyWeather }) => {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);
  let isNotHomePage;
  let isNotAdminPage;
  let isNotKitchenPage;

  useEffect(() => {
    isNotHomePage = window.location.pathname !== "/";
    isNotKitchenPage = window.location.pathname !== "/kitchen";
    isNotAdminPage = !window.location.pathname.startsWith("/Admin");
    if (isNotHomePage && isNotAdminPage && isNotKitchenPage) {
      setShowNav(true);
    } else {
      setShowNav(false);
    }
  }, [window.location.pathname]);

  return (
    <div className="flex flex-col h-[100svh] w-[100svw] relative overflow-hidden">
      <div className={`grow flex bg-gray-50 z-10 relative overflow-y-auto w-[100%] h-[100%]`}>
        {showNav && <MobileLeftNav lefty={lefty} setLefty={setLefty} />}
        <div className={`grow overflow-hidden flex flex-col relative w-[100%] h-[100%]`}>
          <div className="flex flex-col gap-4 h-[100%] w-[100%] bg-[--c60]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
