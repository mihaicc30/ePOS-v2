import React, { useState, useEffect } from "react";
import { getUser } from "../../utils/authUser";
import "./MobileLeftNav.css";

import { useNavigate, useLocation } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import { BsLayoutTextWindowReverse, BsBoxArrowRight } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineSettingsSuggest } from "react-icons/md";

const MobileLeftNav = ({ lefty, setLefty }) => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [activeIndex, setActiveIndex] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(setUser);
  }, []);

  useEffect(() => {}, [user]);

  const handleDivClick = (index) => {
    setActiveIndex(index);
    navigate(`/${index}`);
  };

  const handleLeftyToggle = (e) => {
    setLefty(e.target.checked);
    //dev**+update user in DB
    localStorage.setItem("lefty", e.target.checked);
  };

  const [fullscreen, setFullscreen] = useState(false)
  const toggleFullscreen = () => {
    if(fullscreen) {
      setFullscreen(!fullscreen)
      document.documentElement.requestFullscreen();
    } else {
      setFullscreen(!fullscreen)
      document.exitFullscreen();
    }
  };

  return (
    <div className="MobileLeftNav flex flex-col p-1 relative basis-[5%] h-[100%] border-r-2">
      <div onClick={toggleFullscreen} className={`transition-all duration-75 cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `}>
        <p>Fullscreen Toggle</p>
        <span className="p-2 h-8 w-8 mx-auto bg-[#e8e8e8] shadow-[6px_6px_12px_#c5c5c5_,_-6px_-6px_12px_#ffffff] hover:border-2 hover:border-white active:shadow-[4px_4px_12px_#c5c5c5_,_-4px_-4px_12px_#ffffff] border-t-2 border-b-2 border-t-gray-100 border-b-gray-600 rounded-full"></span>
      </div>

      <div className={`mt-auto transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={() => console.log("To implement auto store mode")}>
        <p>Auto Store</p>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={`transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={() => console.log("To implement dark mode")}>
        <p>Dark Mode</p>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </div>

      <span className="my-2 border-b-2"></span>
      <div className={`transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={() => console.log("To implement left hand mode")}>
        <p>Lefty</p>
        <label className="switch">
          <input type="checkbox" onChange={handleLeftyToggle} />
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
        <p className={`text-sm`}>{localStorage.getItem("displayName").split(" ")[0]}</p>
      </div>
    </div>
  );
};

export default MobileLeftNav;
