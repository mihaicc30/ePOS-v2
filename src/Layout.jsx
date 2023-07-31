import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase/config.jsx";

import MobileLeftNav from "./comp/navBars/MobileLeftNav";
import MobileHeader from "./comp/navBars/MobileHeader";

const Layout = ({ lefty, setLefty, weeklyForecast, setWeeklyForecast, weeklyholiday, weeklyWeather }) => {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);
  let isNotHomePage;
  let isNotAdminPage;

  useEffect(() => {
    isNotHomePage = window.location.pathname !== "/";
    isNotAdminPage = !window.location.pathname.startsWith("/Admin");
    if (isNotHomePage && isNotAdminPage) {
      setShowNav(true);
    } else {
      setShowNav(false);
    }
  }, [window.location.pathname]);

  return (
    <div className="flex flex-col h-[100svh] w-[100svw] relative overflow-hidden">
      {showNav && <MobileHeader weeklyWeather={weeklyWeather} weeklyholiday={weeklyholiday} weeklyForecast={weeklyForecast} setWeeklyForecast={setWeeklyForecast} />}
      <div className={`basis-[95%] flex bg-gray-50 z-10 relative overflow-y-auto`}>
        {showNav && <MobileLeftNav lefty={lefty} setLefty={setLefty} />}
        <div className={`basis-[95%] overflow-hidden flex flex-col h-[100%] relative`}>
          <div className="flex flex-col gap-4 h-[100%] w-[100%] bg-[--c60]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
