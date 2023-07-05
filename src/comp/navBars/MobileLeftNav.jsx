import React, { useState, useEffect } from "react";
import { getUser } from "../../utils/authUser";
import "./MobileLeftNav.css";

import { useNavigate, useLocation } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import { BsLayoutTextWindowReverse, BsBoxArrowRight } from "react-icons/bs";
import { RiShoppingCartLine } from "react-icons/ri";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";

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

  return (
    <div className="MobileLeftNav basis-[5%] flex flex-col justify-end gap-4 bg-[--c60] py-4 relative max-md:gap-1">
      <div className={`transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-lg justify-center font-semibold ${loc.pathname === "/SignOut" ? "MAFA" : ""}`} onClick={() => handleDivClick("SignOut")}>
        <span className="mx-auto text-2xl">
          <BsBoxArrowRight />
        </span>
        <p className={activeIndex === "SignOut" ? "" : "max-sm:hidden"}>Sign Out</p>
      </div>

      <div className={`transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-lg justify-center font-semibold ${loc.pathname === "/Settings" ? "MAFA" : ""}`} onClick={() => handleDivClick("Settings")}>
        <span className="mx-auto text-2xl">
          <MdOutlineSettingsSuggest className="text-3xl" />
        </span>
        <p className={activeIndex === "Settings" ? "" : "max-sm:hidden"}>Settings</p>
      </div>

      <div className={`relative transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-lg justify-center font-semibold `}>
        <span className="mx-auto text-2xl">
          <FaRegUserCircle />
        </span>
        <p className='whitespace-break-spaces break-words line-clamp-2'>User Name</p>
      </div>
    </div>
  );
};

export default MobileLeftNav;
