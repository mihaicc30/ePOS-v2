import React, { useState, useEffect, useRef } from "react";
import { getUser } from "../../utils/authUser";
import { useNavigate, useLocation } from "react-router-dom";

import { MdRestaurantMenu } from "react-icons/md";
import { BsLayoutTextWindowReverse, BsBoxArrowRight } from "react-icons/bs";
import { FaRegUserCircle, FaWind } from "react-icons/fa";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { GiRoundTable } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SiContactlesspayment } from "react-icons/si";
import { IoMdRefreshCircle } from "react-icons/io";
import { TiWeatherCloudy } from "react-icons/ti";
import { WiHumidity } from "react-icons/wi";

const MobileFooter = ({ weeklyForecast, setWeeklyForecast, weeklyholiday, weeklyWeather }) => {

  return (
    <div className="MobileFooter basis-[4%] flex min-sm:gap-4 bg-[--c30] relative items-center font-[600] whitespace-nowrap">
      {localStorage.getItem("isAdmin") !== true && (
        <div className="flex flex-nowrap w-[100%] gap-2 justify-center">
          <p className="border-r-2 pr-2 mr-2">
            {weeklyWeather && weeklyWeather.resolvedAddress}
          </p>
          <p> {weeklyWeather && weeklyWeather.days[0].conditions}</p>
          <p className="text-md border-r-2 pr-2 mr-2"> {weeklyWeather && weeklyWeather.days[0].temp}&deg;</p>
          <div className="flex flex-nowrap gap-2">
            <span className="grid grid-cols-[20px_1fr] gap-1 border-r-2 pr-2 mr-2 text-md">
              <TiWeatherCloudy className="text-2xl" /> {weeklyWeather && weeklyWeather.days[0].cloudcover}%
            </span>
            <span className="grid grid-cols-[20px_1fr] gap-1 border-r-2 pr-2 mr-2 text-md">
              <WiHumidity className="text-2xl" /> {weeklyWeather && weeklyWeather.days[0].humidity}%
            </span>
            <span className="grid grid-cols-[20px_1fr] gap-1 border-r-2 pr-2 mr-2 text-md">
              <FaWind className="text-2xl" /> {weeklyWeather && weeklyWeather.days[0].windspeed}mph
            </span>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default MobileFooter;
