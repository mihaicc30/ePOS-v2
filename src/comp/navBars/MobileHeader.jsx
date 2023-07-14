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
import { TiWeatherCloudy } from "react-icons/ti";
import { WiHumidity } from "react-icons/wi";

const MobileHeader = () => {
  const weatherRef = useRef(null);
  const holidayRef = useRef(null);
  const forecastRef = useRef(null);
  const navigate = useNavigate();
  const loc = useLocation();
  const [activeIndex, setActiveIndex] = useState("Menu");
  const [user, setUser] = useState(null);

  const [weather, setWeather] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [time, setTime] = useState(false);
  const [dayForecast, setDayForecast] = useState(false);

  useEffect(() => {
    getUser(setUser);
  }, [window.location.pathname]);

  useEffect(() => {}, [user]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("https://api.weatherapi.com/v1/current.json?key=df0973195a8141f99d8195727231207&q=worcester%20uk&aqi=no");
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    const fetchHoliday = async () => {
      try {
        const response = await fetch("https://www.gov.uk/bank-holidays.json");
        const data = (await response.json())["england-and-wales"].events;
        let todaysDate = new Date();
        let formattedDate = todaysDate.toISOString().split("T")[0];
        const event = data.find((event) => event.date === formattedDate);
        setHoliday([formattedDate, event]);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    if (localStorage.getItem("isAdmin") !== "1" && weatherRef.current.innerText === "Loading weather..") {
      fetchWeather();
    }

    if (localStorage.getItem("isAdmin") !== "1" && holidayRef.current.innerText === "Loading holiday..") {
      fetchHoliday();
    }
  }, []);

  useEffect(() => {
    if (!weather) return;
    const fetchForecast = async () => {
      setTimeout(async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API}forecast`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
              cloudy: weather.current.cloud,
              humidity: weather.current.humidity,
              windspeed: weather.current.wind_mph,
              temp: weather.current.temp_c,
              daytype: new Date().getDay(),
              isholiday: holiday[1]?.title ? 1 : 0,
            }),
          });
          const data = await response.json();
          console.log(data);
          setDayForecast(data.average);
        } catch (error) {
          console.error("Error fetching weather:", error);
        }
      }, 1111);
    };

    if (localStorage.getItem("isAdmin") !== "1" && forecastRef.current.innerText === "Loading forecast..") {
      fetchForecast();
    }
  }, [weather]);

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

  const getVenueStatus = () => {
    if (!dayForecast) return <AiOutlineLoading3Quarters className="animate-spin mx-auto text-xl" />
  
    if (dayForecast > 5000) {
      return <p className="text-center">Busy</p>;
    } else if (dayForecast < 1500) {
      return <p className="text-center">Quiet</p>;
    } else {
      return <p className="text-center">Average</p>;
    }
  };

  return (
    <div className="MobileHeader basis-[10%] flex min-sm:gap-4 bg-[--c30] min-sm:py-4 relative max-sm:flex-col">
      {localStorage.getItem("isAdmin") !== "1" && (
        <>
        <div className="flex items-center text-5xl border-r-2 pr-2 mr-2 ">
          <p>{time}</p>
        </div>
          <div ref={weatherRef}>
            {!weather && <p>Loading weather..</p>}
            {weather && (
              <div className="flex gap-4">
                <div className="text-2xl p-1 flex flex-col justify-evenly border-r-2 pr-2 mr-2">
                  <p>{weather.location.country}</p>
                  <p>{weather.location.name}</p>
                </div>
                <div>
                  <p className="text-5xl font-bold">{weather.current.temp_c}&deg;</p>
                  <p>{weather.current.condition.text}</p>
                </div>
                <div>
                  <p className="flex flex-col">
                    <span className="grid grid-cols-[20px_1fr] gap-1">
                      <TiWeatherCloudy className="text-2xl" /> {weather.current.cloud}%
                    </span>
                    <span className="grid grid-cols-[20px_1fr] gap-1">
                      <WiHumidity className="text-2xl" /> {weather.current.humidity}%
                    </span>
                    <span className="grid grid-cols-[20px_1fr] gap-1">
                      <FaWind className="text-xl" /> {weather.current.wind_mph}mph
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
          <div ref={holidayRef} className="border-l-2 pl-2 ml-2 border-r-2 pr-2 mr-2">
            {!holiday && <p>Loading holiday..</p>}
            {holiday && (
              <div className="flex flex-col justify-evenly h-[100%]">
                <p className="text-xl">{holiday[0]}</p>
                {holiday[1]?.title ? <p className="text-xl">{holiday[1].title}</p> : "No events today."}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center border-r-2 pr-2 mr-2 ">
            <p className="text-center">Forecast</p>
            <div ref={forecastRef} className="text-center">
              {!dayForecast && <p className="text-center">Loading forecast..</p>}
              {dayForecast && <p className={`text-center text-xl ${dayForecast > 5000 ? "text-green-400" : dayForecast < 1500 ? "text-red-400" : "text-yellow-400"} `}>£{dayForecast}</p>}
            </div>
            {getVenueStatus()}
          </div>
        </>
      )}
      {localStorage.getItem("isAdmin") === "1" && (
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
