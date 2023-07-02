import React, { useState, useEffect } from "react";
import "./Home.css";

import MenuItem from "./MenuItem";
import { BrowserRouter, Routes, Route, Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

const Menu = ({ user, updateUser, menuitems }) => {
  useEffect(() => {}, [user]);

  const [viewSearch, setViewSearch] = useState(false);
  const nav = useNavigate();

  const location = useLocation();
  const isBaseRoute = location.pathname === "/";

  return (
    <div className={`basis-[80%] flex flex-col bg-[--c60] z-10 ${isBaseRoute ? "overflow-y-scroll" : "overflow-y-hidden"} relative`}>
      {/* search box */}
      {viewSearch && <p>X</p>}

      {/* menu view */}
      {!viewSearch && (
        <div className="flex flex-col gap-4 ">
          <div className="flex relative">
            <input type="text" placeholder="Search..." className="w-[98%] mx-auto pl-8 pr-4 py-2 my-2" />
            <span className="absolute top-1/2 left-4 -translate-y-3">🔍</span>
          </div>

          <div className="relative">
            <Outlet />
            {menuitems.map((item, index) => (
              <div key={index} className="p-2 flex flex-col cursor-pointer hover:scale-[0.98] transition-all" onClick={() => nav(item.name)}>
                <img src={item.img} className="h-[100px] w-[100%]" style={{ objectFit: "cover", overflow: "hidden" }} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
