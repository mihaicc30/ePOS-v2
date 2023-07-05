import React, { useState, useEffect } from "react";
import { getUser } from "../../utils/authUser";
import { useNavigate, useLocation } from "react-router-dom";

import { MdRestaurantMenu } from "react-icons/md";
import { BsLayoutTextWindowReverse, BsBoxArrowRight } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { GiRoundTable } from "react-icons/gi";
import { SiContactlesspayment } from "react-icons/si";

const MobileHeader = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [activeIndex, setActiveIndex] = useState("");
  const [user, setUser] = useState(null);

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
        <img src="./assets/d956248b8cfe7fe8fa39033b50728bcb.jpg" className="w-[100px] mx-auto" />
      </div>
      <div className="basis-[90%] flex text-center justify-center text-lg font-semibold">
          <div className={`basis-[20%] m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/Tables" ? "MAFA" : "bg-gray-50"}`} onClick={() => handleDivClick("Tables")}>
            <span className="mx-auto text-xl">
              <GiRoundTable className="text-3xl" />
            </span>
            <p className={activeIndex === "Tables" ? "" : "max-sm:hidden"}>Tables</p>
          </div>

          <div className={`basis-[20%] m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/Menu" ? "MAFA" : "bg-gray-50"}`} onClick={() => handleDivClick("Menu")}>
            <span className="mx-auto text-xl">
              <MdOutlineSettingsSuggest className="text-3xl" />
            </span>
            <p className={activeIndex === "Menu" ? "" : "max-sm:hidden"}>Menu</p>
          </div>

          <div className={`relative basis-[20%] m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${loc.pathname === "/Payment" ? "MAFA" : "bg-gray-50"}`} onClick={() => handleDivClick("Payment")}>
            <span className="mx-auto text-xl">
              <SiContactlesspayment className="text-3xl" />
            </span>
            <p className={activeIndex === "Payment" ? "" : "max-sm:hidden"}>Payment</p>
          </div>
      </div>
    </div>
  );
};

export default MobileHeader;
