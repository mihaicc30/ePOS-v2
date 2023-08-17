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

const MobileHeader = ({ weeklyForecast, setWeeklyForecast, weeklyholiday, weeklyWeather }) => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [activeIndex, setActiveIndex] = useState("Menu");
  const [user, setUser] = useState(null);

  const [weather, setWeather] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [time, setTime] = useState(false);

  const reloadWeeklyForecast = () => {
    localStorage.setItem("refreshForecast", true);
    setWeeklyForecast({
      0: { date: null, average: null },
      1: { date: null, average: null },
      2: { date: null, average: null },
      3: { date: null, average: null },
      4: { date: null, average: null },
      5: { date: null, average: null },
      6: { date: null, average: null },
    });
    fetchForecastWeek();
  };

  const fetchForecastWeek = async () => {
    if (!weeklyWeather) return;

    for (let n = 0; n < 7; n++) {
      let dayt = (new Date().getDay() + n) % 7;

      setTimeout(async () => {
        let tempz = {
          cloudy: weeklyWeather.forecast.forecastday[`${n}`].hour[12].cloud,
          humidity: weeklyWeather.forecast.forecastday[`${n}`].hour[12].humidity,
          windspeed: weeklyWeather.forecast.forecastday[`${n}`].hour[12].wind_mph,
          temp: weeklyWeather.forecast.forecastday[`${n}`].hour[12].temp_c,
          daytype: dayt,
          isholiday: weeklyholiday[`${n}`]?.title ? 1 : 0,
        };
        // console.log(`calling forecast api with this data:`, tempz);
        try {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + n);
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const day = String(currentDate.getDate()).padStart(2, "0");
          const response = await fetch(`${import.meta.env.VITE_API}forecast-quick`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
              date: currentDate.toLocaleDateString("en-GB"),
              cloudy: weeklyWeather.forecast.forecastday[n].hour[12].cloud,
              humidity: weeklyWeather.forecast.forecastday[n].hour[12].humidity,
              windspeed: weeklyWeather.forecast.forecastday[n].hour[12].wind_mph,
              temp: weeklyWeather.forecast.forecastday[n].hour[12].temp_c,
              daytype: dayt,
              isholiday: weeklyholiday[`${n}`]?.title ? 1 : 0,
              venueID: localStorage.getItem("venueID"),
              forceRefresh: localStorage.getItem("refreshForecast"),
            }),
          });
          const data = await response.json();

          setWeeklyForecast((prevState) => ({
            ...prevState,
            [n]: { date: `${year}-${month}-${day}`, average: data.average },
          }));
          localStorage.removeItem("refreshForecast");
        } catch (error) {
          localStorage.removeItem("refreshForecast");
          console.error("Error fetching weather:", error);
        }
      }, 500);
    }
  };

  useEffect(() => {
    getUser(setUser);
  }, [window.location.pathname]);

  useEffect(() => {}, [user]);

  const handleDivClick = (index) => {
    setActiveIndex(index);
    navigate(`/${index}`);
  };

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 25000);
    //25000ms = 25s , dont mind the 25s time error
    //want better value the resources than accurately update the time
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getVenueStatus = (AVG) => {
    if (AVG > 3000) {
      return <p className="text-center">Busy</p>;
    } else if (AVG < 2000) {
      return <p className="text-center">Quiet</p>;
    } else {
      return <p className="text-center">Average</p>;
    }
  };

  return (
    <div className="MobileHeader basis-[4%] flex min-sm:gap-4 bg-[--c30] relative items-center font-[600] whitespace-nowrap">
      {localStorage.getItem("isAdmin") !== true && (
        <div className="flex flex-nowrap w-[100%] gap-2 justify-center">
          <p className="text-md border-r-2 pr-2 mr-2">{time}</p>
          {weeklyholiday && <p className="text-md border-r-2 pr-2 mr-2">{weeklyholiday[0][0] || "0"}</p>}
          {weeklyholiday && weeklyholiday[0][1]?.title ? <p className="text-md border-r-2 pr-2 mr-2">{weeklyholiday[0][1].title}</p> : <p className="text-md border-r-2 pr-2 mr-2">No events today.</p>}

          <button className="flex justify-center items-center" onClick={() => reloadWeeklyForecast()}>
            <IoMdRefreshCircle className="text-2xl ml-3 fill-[--c1] shadow-xl rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
          </button>
          <div className="flex flex-nowrap gap-4 text-md">
            <p className="text-center ">Forecast</p>
            <div className="text-center"> {weeklyholiday && weeklyForecast["0"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["0"]?.average > 3000 ? "text-green-400" : weeklyForecast["0"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["0"]?.average}</p>}</div>
            {getVenueStatus(weeklyForecast["0"]?.average)}
          </div>
        </div>
      )}
      {localStorage.getItem("isAdmin") === "true" && (
        <>
          <div className="basis-[10%] flex flex-col text-center text-lg font-semibold">
            <img src="./assets/d956248b8cfe7fe8fa39033b50728bcb.jpg" className="w-[100px] mx-auto" />
          </div>
          <div className="basis-[90%] flex text-center justify-center text-lg font-semibold">
            <div className={`border-b-2 border-b-black basis-[20%] m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${window.location.pathname === "/Tables" ? "bg-[--c1] shadow-[inset_2px_2px_2px_black]" : "bg-gray-50"}`} onClick={() => handleDivClick("Tables")}>
              <span className="mx-auto text-xl">
                <GiRoundTable className="text-3xl" />
              </span>
              <p className={activeIndex === "Tables" ? "" : "max-sm:hidden"}>Tables</p>
            </div>

            <div className={`border-b-2 border-b-black basis-[20%] m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${window.location.pathname === "/Menu" ? "bg-[--c1] shadow-[inset_2px_2px_2px_black]" : "bg-gray-50"}`} onClick={() => handleDivClick("Menu")}>
              <span className="mx-auto text-xl">
                <MdOutlineSettingsSuggest className="text-3xl" />
              </span>
              <p className={activeIndex === "Menu" ? "" : "max-sm:hidden"}>Menu</p>
            </div>

            <div className={`border-b-2 border-b-black relative basis-[20%] m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${window.location.pathname === "/Payment" ? "bg-[--c1] shadow-[inset_2px_2px_2px_black]" : "bg-gray-50"}`} onClick={() => handleDivClick("Payment")}>
              <span className="mx-auto text-xl">
                <SiContactlesspayment className="text-3xl" />
              </span>
              <p className={activeIndex === "Payment" ? "" : "max-sm:hidden"}>Payment</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileHeader;
