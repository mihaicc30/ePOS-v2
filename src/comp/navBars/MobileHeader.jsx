import React, { useState, useEffect } from "react";
import { getUser } from "../../utils/authUser";
import { useNavigate, useLocation } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import { BsLayoutTextWindowReverse, BsBoxArrowRight } from "react-icons/bs";
import { RiShoppingCartLine } from "react-icons/ri";
import { MdOutlineSettingsSuggest } from "react-icons/md";

const MobileHeader = () => {
  const [user, setUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState("");
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    getUser(setUser);
  }, [window.location.pathname]);

  useEffect(() => {}, [user]);
  
  const handleDivClick = (index) => {
    setActiveIndex(index);
    navigate(`/${index}`);
  };

  return (
    <div className="MobileHeader basis-[10%] flex min-sm:gap-4 bg-[--c30] min-sm:py-4 relative max-sm:flex-col">
      <div className="basis-[10%] flex flex-col text-center text-lg font-semibold">
        <img src="./assets/d956248b8cfe7fe8fa39033b50728bcb.jpg" className="w-auto mx-auto" />
      </div>
      <div className="basis-[90%] flex text-center justify-center text-lg font-semibold gap-8">
        <div className={`px-4 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-lg justify-center font-semibold ${loc.pathname === "/Menu" ? "MAFA" : ""}`} onClick={() => handleDivClick("Menu")}>
          <span className="mx-auto text-2xl">
            <MdRestaurantMenu />
          </span>
          <p className={activeIndex === "Menu" ? "" : "max-sm:hidden"}>Payment</p>
        </div>
        <span className="border-r-2"></span>
        <div className={`relative px-4 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-lg justify-center font-semibold ${loc.pathname === "/Basket" ? "MAFA" : ""}`} onClick={() => handleDivClick("Basket")}>
          <span className="mx-auto text-2xl">
            <RiShoppingCartLine />
          </span>
          <p className={activeIndex === "Basket" ? "" : "max-sm:hidden"}>Menu</p>
        </div>
        <span className="border-r-2"></span>
        <div className={`px-4 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-3xl flex flex-col text-center text-lg justify-center font-semibold ${loc.pathname === "/Settings" ? "MAFA" : ""}`} onClick={() => handleDivClick("Settings")}>
          <span className="mx-auto text-2xl">
            <MdOutlineSettingsSuggest className="text-3xl" />
          </span>
          <p className={activeIndex === "Settings" ? "" : "max-sm:hidden"}>Tables</p>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
