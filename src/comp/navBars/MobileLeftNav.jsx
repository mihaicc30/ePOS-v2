import React, { useState, useEffect } from "react";
import { getUser } from "../../utils/authUser";
import "./MobileLeftNav.css";

import { useNavigate, useLocation } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import { BsLayoutTextWindowReverse, BsBoxArrowRight, BsArrowsFullscreen } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { CgDarkMode } from "react-icons/cg";

const MobileLeftNav = ({ lefty, setLefty }) => {
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

  const handleLeftyToggle = (e) => {
    const isChecked = e.target.checked;
    setLefty(isChecked);
    localStorage.setItem("lefty", isChecked);
  };

  //in production this will have a default of true
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  
    if (!fullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="MobileLeftNav flex flex-col p-1 relative basis-[5%] h-[100%] border-r-2">
      <div className={`rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `}>
        <BsArrowsFullscreen className="mx-auto text-xl my-1"/>
        <label className="switch cursor-pointer">
          <input type="checkbox" onChange={toggleFullscreen}/>
          <span className="slider"></span>
        </label>
      </div>

      <span className="mt-auto my-2 border-b-2"></span>
      <div className={`rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={() => console.log("To implement dark mode")}>
        <CgDarkMode className="mx-auto my-1 text-2xl"/>
        <label className="switch cursor-pointer">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={`rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={() => console.log("To implement left hand mode")}>
        <p>Lefty</p>
        <label className="switch cursor-pointer">
          <input type="checkbox" onChange={handleLeftyToggle} />
          <span className="slider"></span>
        </label>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={`transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/SignOut" ? "MAFA" : ""}`} onClick={() => handleDivClick("SignOut")}>
        <span className="mx-auto text-md">
          <BsBoxArrowRight className="text-2xl" />
        </span>
        <p className={`${activeIndex === "SignOut" ? "" : "max-sm:hidden"} text-xs`}>Sign Out</p>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={`transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/Settings" ? "MAFA" : ""}`} onClick={() => handleDivClick("Settings")}>
        <span className="mx-auto text-md">
          <MdOutlineSettingsSuggest className="text-2xl" />
        </span>
        <p className={`${activeIndex === "Settings" ? "" : "max-sm:hidden"} text-xs`}>Settings</p>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={`cursor-none rounded-3xl flex flex-col text-center text-sm justify-center font-semibold`}>
        <span className="mx-auto text-md">
          <FaRegUserCircle className="text-2xl" />
        </span>
        <p className={`text-xs`}>{user && localStorage.getItem("displayName")?.split(" ")[0]}</p>
      </div>
    </div>
  );
};

export default MobileLeftNav;
