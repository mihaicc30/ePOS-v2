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
    localStorage.setItem("forecast7", "false");
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
    if (localStorage.getItem("forecast7") === "true" || !localStorage.getItem("forecast7")) return;
    localStorage.setItem("forecast7", true);

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
        console.log(`calling forecast api with this data:`, tempz);
        try {
          const response = await fetch(`${import.meta.env.VITE_API}forecast-quick`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
              cloudy: weeklyWeather.forecast.forecastday[n].hour[12].cloud,
              humidity: weeklyWeather.forecast.forecastday[n].hour[12].humidity,
              windspeed: weeklyWeather.forecast.forecastday[n].hour[12].wind_mph,
              temp: weeklyWeather.forecast.forecastday[n].hour[12].temp_c,
              daytype: dayt,
              isholiday: weeklyholiday[`${n}`]?.title ? 1 : 0,
            }),
          });
          const data = await response.json();

          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + n);
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const day = String(currentDate.getDate()).padStart(2, "0");

          setWeeklyForecast((prevState) => ({
            ...prevState,
            [n]: { date: `${year}-${month}-${day}`, average: data.average },
          }));
        } catch (error) {
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
    if (AVG > 5000) {
      return <p className="text-center">Busy</p>;
    } else if (AVG < 1500) {
      return <p className="text-center">Quiet</p>;
    } else {
      return <p className="text-center">Average</p>;
    }
  };

  return (
    <div className="MobileHeader basis-[10%] flex min-sm:gap-4 bg-[--c30] min-sm:py-4 relative max-sm:flex-col">
      {localStorage.getItem("isAdmin") !== true && (
        <>
          <div className="flex items-center text-5xl border-r-2 pr-2 mr-2 ">
            <p>{time}</p>
          </div>
          <div className="border-r-2 pr-2 mr-2">
            <div className="flex flex-col justify-evenly h-[100%]">
            {weeklyholiday && <p className="text-xl">{weeklyholiday[0][0] || "0"}</p> }
              {weeklyholiday && weeklyholiday[0][1]?.title ? <p className="text-xl">{weeklyholiday[0][1].title}</p> : "No events today."}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex gap-4">
              <div className="text-2xl p-1 flex flex-col justify-evenly border-r-2 pr-2 mr-2">
                <p> {weeklyWeather && weeklyWeather.location.name}</p>
                <p> {weeklyWeather && weeklyWeather.location.country}</p>
              </div>
              <div>
                <p className="text-5xl font-bold"> {weeklyWeather && weeklyWeather.forecast.forecastday[0].hour[12].temp_c}&deg;</p>
                <p> {weeklyWeather && weeklyWeather.forecast.forecastday[0].hour[12].condition.text}</p>
              </div>
              <div>
                <p className="flex flex-col">
                  <span className="grid grid-cols-[20px_1fr] gap-1">
                    <TiWeatherCloudy className="text-2xl" /> {weeklyWeather && weeklyWeather.forecast.forecastday[0].hour[12].cloud}%
                  </span>
                  <span className="grid grid-cols-[20px_1fr] gap-1">
                    <WiHumidity className="text-2xl" /> {weeklyWeather && weeklyWeather.forecast.forecastday[0].hour[12].humidity}%
                  </span>
                  <span className="grid grid-cols-[20px_1fr] gap-1">
                    <FaWind className="text-xl" /> {weeklyWeather && weeklyWeather.forecast.forecastday[0].hour[12].wind_mph}mph
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-nowrap justify-center items-center border-r-2 pr-2 mr-2 border-l-2 pl-2 ml-2 ">
            <div>
              <p className="text-center">Forecast</p>
              <div className="text-center"> {weeklyholiday && weeklyForecast["0"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["0"]?.average > 5000 ? "text-green-400" : weeklyForecast["0"]?.average < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["0"]?.average}</p>}</div>
              {getVenueStatus(weeklyForecast["0"]?.average)}
            </div>
            <button onClick={() => reloadWeeklyForecast()}>
              <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-xl rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
            </button>
          </div>
        </>
      )}
      {localStorage.getItem("isAdmin") == true && (
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
