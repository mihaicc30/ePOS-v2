import React, { useState, useEffect } from "react";
import { getUser } from "../../utils/authUser";
import "./MobileLeftNav.css";

import { useNavigate, useLocation } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import { BsLayoutTextWindowReverse, BsBoxArrowRight } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineSettingsSuggest } from "react-icons/md";

const MobileLeftNav = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [activeIndex, setActiveIndex] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(setUser);
  }, []);

  const handleDivClick = (index) => {
    setActiveIndex(index);
    navigate(`/${index}`);
  };

  const menuPaths = ["/menu", "/desserts", "/breakfast", "/kids%20starters", "/kids%20mains", "/drinks", "/starters", "/mains"];

  return (
    <div className="MobileLeftNav flex flex-col p-1 relative basis-[5%] h-[100%] border-r-2">
      <div className={`mt-auto transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={() => console.log("Implement dark mode")}>
        <p>Dark Mode</p>
        <label className="theme">
          <input className="input" defaultChecked="checked" type="checkbox" />
          <svg width="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="icon icon-sun">
            <circle r="5" cy="12" cx="12"></circle>
            <line y2="3" y1="1" x2="12" x1="12"></line>
            <line y2="23" y1="21" x2="12" x1="12"></line>
            <line y2="5.64" y1="4.22" x2="5.64" x1="4.22"></line>
            <line y2="19.78" y1="18.36" x2="19.78" x1="18.36"></line>
            <line y2="12" y1="12" x2="3" x1="1"></line>
            <line y2="12" y1="12" x2="23" x1="21"></line>
            <line y2="18.36" y1="19.78" x2="5.64" x1="4.22"></line>
            <line y2="4.22" y1="5.64" x2="19.78" x1="18.36"></line>
          </svg>
          <svg width="18" viewBox="0 0 24 24" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="icon icon-moon">
            <path d="m12.3 4.9c.4-.2.6-.7.5-1.1s-.6-.8-1.1-.8c-4.9.1-8.7 4.1-8.7 9 0 5 4 9 9 9 3.8 0 7.1-2.4 8.4-5.9.2-.4 0-.9-.4-1.2s-.9-.2-1.2.1c-1 .9-2.3 1.4-3.7 1.4-3.1 0-5.7-2.5-5.7-5.7 0-1.9 1.1-3.8 2.9-4.8zm2.8 12.5c.5 0 1 0 1.4-.1-1.2 1.1-2.8 1.7-4.5 1.7-3.9 0-7-3.1-7-7 0-2.5 1.4-4.8 3.5-6-.7 1.1-1 2.4-1 3.8-.1 4.2 3.4 7.6 7.6 7.6z"></path>
          </svg>
        </label>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={`transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={() => console.log("Implement dark mode")}>
        <p>Lefty</p>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={`transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/SignOut" ? "MAFA" : ""}`} onClick={() => handleDivClick("SignOut")}>
        <span className="mx-auto text-md">
          <BsBoxArrowRight className="text-2xl" />
        </span>
        <p className={`${activeIndex === "SignOut" ? "" : "max-sm:hidden"} text-sm`}>Sign Out</p>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={` transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/Settings" ? "MAFA" : ""}`} onClick={() => handleDivClick("Settings")}>
        <span className="mx-auto text-md">
          <MdOutlineSettingsSuggest className="text-2xl" />
        </span>
        <p className={`${activeIndex === "Settings" ? "" : "max-sm:hidden"} text-sm`}>Settings</p>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={` transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold`}>
        <span className="mx-auto text-md">
          <FaRegUserCircle className="text-2xl" />
        </span>
        <p className={`text-sm`}>User name</p>
      </div>
    </div>
  );
};

export default MobileLeftNav;
