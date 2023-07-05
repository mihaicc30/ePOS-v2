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
    <div className="MobileLeftNav flex flex-col bg-[--c60] p-1 relative basis-[5%]">
      <div className={`mt-auto transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/SignOut" ? "MAFA" : ""}`} onClick={() => handleDivClick("SignOut")}>
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
      <div className={` transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/Basket" ? "MAFA" : ""}`} onClick={() => handleDivClick("Basket")}>
        <span className="mx-auto text-md">
          <FaRegUserCircle className="text-2xl" />
        </span>
        <p className={`${activeIndex === "Basket" ? "" : "max-sm:hidden"} text-sm`}>User name</p>
      </div>
    </div>
  );
};

export default MobileLeftNav;
