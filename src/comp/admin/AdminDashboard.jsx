import React, { useState, useEffect, useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdRefreshCircle } from "react-icons/io";
import { TiWeatherCloudy } from "react-icons/ti";
import { WiHumidity } from "react-icons/wi";
import { FaRegUserCircle, FaWind } from "react-icons/fa";

import ChartSales from "./AdminComp/ChartSales";
import NetProfit from "./AdminComp/NetProfit";

const AdminDashboard = ({ dayForecast, setDayForecast, weeklyForecast, setWeeklyForecast }) => {
  const [weather, setWeather] = useState(false);
  const [weeklyWeather, setWeeklyWeather] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [weeklyholiday, setWeeklyHoliday] = useState(false);
  const [time, setTime] = useState(false);

  const [timeOfWeather, setTimeOfWeather] = useState(12);

  const weatherRef = useRef(null);
  const holidayRef = useRef(null);
  const forecastRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") == "1" && weatherRef.current.innerText === "Loading weather..") {
      fetchWeather();
      fetchWeeklyWeather();
    }
  }, [timeOfWeather]);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") == "1" && holidayRef.current.innerText === "Loading holiday..") {
      fetchHoliday();
    }
  }, []);

  const getVenueStatus = (day) => {
    if (!day) return <AiOutlineLoading3Quarters className="animate-spin mx-auto text-xl" />;

    if (day > 5000) {
      return <p className="text-center">Busy</p>;
    } else if (day < 1500) {
      return <p className="text-center">Quiet</p>;
    } else {
      return <p className="text-center">Average</p>;
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch("https://api.weatherapi.com/v1/current.json?key=df0973195a8141f99d8195727231207&q=worcester%20uk&aqi=no");
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const fetchWeeklyWeather = async () => {
    try {
      const response = await fetch("http://api.weatherapi.com/v1/forecast.json?key=df0973195a8141f99d8195727231207&q=worcester%20uk&days=7&aqi=no&alerts=no");
      const data = await response.json();
      setWeeklyWeather(data);
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

      let currentDate = new Date();
      let holidays = [];
      for (let i = 0; i < 7; i++) {
        let formattedDate = currentDate.toISOString().split("T")[0];
        const event = data.find((event) => event.date === formattedDate);
        console.log(event);
        holidays.push([formattedDate, event]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setWeeklyHoliday(holidays);
      setHoliday([formattedDate, event]);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const fetchForecast = async () => {
    if (!weather) return;
    if (localStorage.getItem("forecast1") === "true") return;
    localStorage.setItem("forecast1", true);
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
        setDayForecast(data.average);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    }, 1111);
  };

  const fetchForecastWeek = async (n) => {
    if (!weather) return;
    if (!weeklyWeather) return;
    if (localStorage.getItem("forecast7") === "true") return;
    localStorage.setItem("forecast7", true);

    for (let n = 1; n < 7; n++) {
      let dayt = (new Date().getDay() + n) % 7;

      setTimeout(async () => {
        let tempz = {
          cloudy: weeklyWeather.forecast.forecastday[`${n - 1}`].hour[12].cloud,
          humidity: weeklyWeather.forecast.forecastday[`${n - 1}`].hour[12].humidity,
          windspeed: weeklyWeather.forecast.forecastday[`${n - 1}`].hour[12].wind_mph,
          temp: weeklyWeather.forecast.forecastday[`${n - 1}`].hour[12].temp_c,
          daytype: dayt,
          isholiday: weeklyholiday[`${n - 1}`]?.title ? 1 : 0,
        };
        console.log(`calling api with this data:`, tempz);
        try {
          const response = await fetch(`${import.meta.env.VITE_API}forecast-quick`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
              cloudy: weeklyWeather.forecast.forecastday[n - 1].hour[12].cloud,
              humidity: weeklyWeather.forecast.forecastday[n - 1].hour[12].humidity,
              windspeed: weeklyWeather.forecast.forecastday[n - 1].hour[12].wind_mph,
              temp: weeklyWeather.forecast.forecastday[n - 1].hour[12].temp_c,
              daytype: dayt,
              isholiday: holiday[1]?.title ? 1 : 0,
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
      }, 1111);
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "1";
    const isForecastLoading = forecastRef.current.innerText === "Loading forecast..";

    if (isAdmin && isForecastLoading) fetchForecast();
    if (!weeklyForecast["1"]?.date) reloadWeeklyForecast();
  }, [weather]);

  const reloadWeeklyForecast = () => {
    setWeeklyForecast({
      1: { date: null, average: null },
      2: { date: null, average: null },
      3: { date: null, average: null },
      4: { date: null, average: null },
      5: { date: null, average: null },
      6: { date: null, average: null },
    });
    fetchForecastWeek();
  };

  const resetForecastQuery = () => {
    localStorage.setItem("forecast1", "false");
    localStorage.setItem("forecast7", "false");
  };
  const getDaysTillPayday = () => {
    const payDay = 15;
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const nextPayDate = new Date(currentYear, currentMonth, payDay);
    if (nextPayDate < currentDate) {
      nextPayDate.setMonth(currentMonth + 1);
    }

    const timeDifference = nextPayDate.getTime() - currentDate.getTime();
    const daysUntilPay = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysUntilPay;
  };
  // https://www.touchbistro.com/blog/21-restaurant-metrics-and-how-to-calculate-them/
  // just an usefull link https://recharts.org/en-US/examples/BrushBarChart
  return (
    <div className="flex flex-col gap-4 overflow-y-auto relative">
      <p className="text-xl font-bold p-2 ">-Dashboard-</p>

      <div className="flex flex-col gap-4 overflow-y-auto relative">
        <p className="text-xl font-bold p-2">General Info</p>
        <div className="flex flex-wrap">
          {/* ------------------------------ */}
          <div className="widget flex-[1_1_30%] shadow-xl flex justify-center flex-col items-center min-w-[400px] min-h-[300px]">
            <p className="text-xl font-bold px-2 text-center whitespace-nowrap">Today's Sales</p>
            <p className="text-xs font-bold px-2 text-center whitespace-nowrap">12:00-22:00</p>
            <ChartSales />
          </div>
          {/* ------------------------------ */}
          <div className="widget flex-[1_1_30%] shadow-xl flex justify-center flex-col items-center min-w-[400px] min-h-[300px]">
            <p className="text-xl font-bold px-2 text-center whitespace-nowrap">Net Profit/ Hour</p>
            <p className="text-xs font-bold px-2 text-center whitespace-nowrap">12:00-22:00</p>
            <NetProfit />
          </div>
          {/* ------------------------------ */}

          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center min-w-[200px]">
            <div className="grid grid-cols-1 justify-items-center p-4 ">
              <p className="text-xl font-bold p-2 text-center whitespace-nowrap">Today's Forecast</p>
              <button
                onClick={() => {
                  resetForecastQuery();
                  setDayForecast(false);
                  fetchForecast();
                  reloadWeeklyForecast();
                }}>
                <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-xl rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
              </button>
              <div className="p-3 flex flex-col">
                <p className="text-center">{new Date(new Date().toISOString().split("T")[0]).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                {dayForecast && <p className="text-center">{new Date().toISOString().split("T")[0]}</p>}
                <span className="border-b-2 border-b-orange-400 flex-1"></span>
                {dayForecast && <p className="text-center">Forecast</p>}
                <div ref={forecastRef} className="text-center">
                  {!dayForecast && <p className="text-center">Loading forecast..</p>}
                  {dayForecast && <p className={`text-center font-[600] text-xl ${dayForecast > 5000 ? "text-green-400" : dayForecast < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{dayForecast}</p>}
                </div>
                {getVenueStatus(dayForecast)}
              </div>
            </div>
          </div>
          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center flex-col items-center min-w-[200px] min-h-[120px]">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width={64} height={64} viewBox="0 0 508 508">
                <path
                  d="M496 240.5c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16V32.7c0-8.8 7.2-16 16-16h336c8.8 0 16 7.2 16 16v207.8z"
                  style={{
                    fill: "#f7bb83",
                  }}
                />
                <path
                  d="M480 268.5H144c-15.4 0-28-12.6-28-28V32.7c0-15.4 12.6-28 28-28h336c15.4 0 28 12.6 28 28v207.8c0 15.4-12.6 28-28 28zM144 28.7c-2.2 0-4 1.8-4 4v207.8c0 2.2 1.8 4 4 4h336c2.2 0 4-1.8 4-4V32.7c0-2.2-1.8-4-4-4H144z"
                  style={{
                    fill: "#ca5212",
                  }}
                />
                <path
                  d="M128 52.7h372v48H128z"
                  style={{
                    fill: "#ca5212",
                  }}
                />
                <path
                  d="M260 120.7h204v40H260z"
                  style={{
                    fill: "#f6e89a",
                  }}
                />
                <path
                  d="M472.5 169.2h-221v-57h221v57zm-204-17h187v-23h-187v23z"
                  style={{
                    fill: "#ca5212",
                  }}
                />
                <path
                  d="M416 188.7v199.5l-404 .5v-200z"
                  style={{
                    fill: "#b2eda6",
                  }}
                />
                <path
                  d="M12 391.7c-.8 0-1.6-.3-2.1-.9-.6-.6-.9-1.3-.9-2.1v-200c0-1.7 1.3-3 3-3h404c1.7 0 3 1.3 3 3v199.5c0 1.7-1.3 3-3 3l-404 .5zm3-200v194l398-.5V191.7H15z"
                  style={{
                    fill: "#3c663e",
                  }}
                />
                <ellipse
                  cx={266.7}
                  cy={456}
                  rx={190.7}
                  ry={47.3}
                  style={{
                    opacity: 0.5,
                    fill: "#b8cbcd",
                    enableBackground: "new",
                  }}
                />
                <path
                  d="M464 240.7v199.5l-400 .5v-200z"
                  style={{
                    fill: "#b2eda6",
                  }}
                />
                <path
                  d="M64 449.2c-2.3 0-4.4-.9-6-2.5s-2.5-3.8-2.5-6v-200c0-4.7 3.8-8.5 8.5-8.5h400c4.7 0 8.5 3.8 8.5 8.5v199.5c0 4.7-3.8 8.5-8.5 8.5l-400 .5zm8.5-200v183l383-.5V249.2h-383z"
                  style={{
                    fill: "#3c663e",
                  }}
                />
                <circle
                  cx={250.2}
                  cy={338.4}
                  r={57.7}
                  style={{
                    fill: "#84c671",
                  }}
                />
                <path
                  d="M60 448.7c-3.2 0-6.2-1.3-8.5-3.5-2.3-2.3-3.5-5.3-3.5-8.5v-36H12c-6.6 0-12-5.4-12-12v-200c0-6.6 5.4-12 12-12h404c6.6 0 12 5.4 12 12v36h36c6.6 0 12 5.4 12 12v199.5c0 6.6-5.4 12-12 12l-404 .5zm-36-72h36c6.6 0 12 5.4 12 12v36l380-.5V248.7h-36c-6.6 0-12-5.4-12-12v-36H24v176z"
                  style={{
                    fill: "#3c663e",
                  }}
                />
              </svg>
            </span>
            <p className="text-center">
              <span className="text-xl font-bold">{getDaysTillPayday()}</span> Days until next payday
            </p>
          </div>
          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center flex-col items-center min-w-[200px] min-h-[120px]">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width={64} height={64} viewBox="0 0 512 512">
                <circle
                  cx={256}
                  cy={256}
                  r={256}
                  style={{
                    fill: "#e6e6e6",
                  }}
                />
                <path
                  d="M117.82 364.108c-6.472-9.968-3.64-23.296 6.328-29.768l16.044-10.416c-9.968 6.476-23.296 3.64-29.768-6.328-6.472-9.964-3.64-23.288 6.328-29.764l12.032-7.812.02.028c21.548-13.98 64.964-42.228 74.176-48.212 17.928-11.644 43.088-25.788 39.112-45.712 48.78-35.876 65.66-2.284 97.236-2.916l16.244-10.548 61.212 94.252-16.428 10.672c7.916 19.508-13.8 40.32-21.744 45.476-7.696 5-85.46 55.5-123.976 80.516-9.884 6.416-17.184 11.156-20.052 13.016l-12.032 7.82-.08-.116c-9.672 4.86-21.656 1.772-27.688-7.516s-3.976-21.488 4.4-28.344l-.076-.116-14.04 9.116c-9.968 6.468-23.296 3.64-29.768-6.328-6.476-9.968-3.64-23.292 6.328-29.768l-14.036 9.116c-9.972 6.452-23.3 3.624-29.772-6.348z"
                  style={{
                    fill: "#f4c395",
                  }}
                />
                <path
                  d="m379.192 287.824-12.032-7.812-.02.028c-21.548-13.976-64.964-42.228-74.18-48.212-17.924-11.644-43.084-25.788-39.108-45.712a139.7 139.7 0 0 0-5.88-4.068 131.703 131.703 0 0 0-5.88 4.068c3.976 19.924-21.184 34.072-39.112 45.712-9.212 5.984-52.628 34.236-74.176 48.212l-.02-.028-12.032 7.812c-9.84 6.396-12.712 19.456-6.552 29.384 2.752 2.636 5.308 4.656 7.136 5.84.908.588 2.82 1.832 5.496 3.572 5.704 1.552 12.012.78 17.364-2.696l-10.756 6.984c25.04 16.26 81.028 52.62 111.876 72.656 2.384 1.548 4.604 2.984 6.66 4.32 2.06-1.336 4.28-2.772 6.664-4.32 30.844-20.036 86.836-56.396 111.876-72.656l-10.756-6.984c5.352 3.476 11.664 4.244 17.368 2.688 2.672-1.736 4.584-2.972 5.492-3.568 1.828-1.184 4.384-3.204 7.132-5.836 6.152-9.928 3.28-22.988-6.56-29.384z"
                  style={{
                    fill: "#e6d9b8",
                  }}
                />
                <path
                  d="M380.415 155.569h21.519v121.942h-21.519z"
                  style={{
                    fill: "#a6a6a6",
                  }}
                  transform="scale(-1) rotate(-32.992 -731.242 1320.973)"
                />
                <path
                  d="m360.484 149.496 79.444 122.324 70.284-45.644c-5.964-51.408-27.148-98.148-58.94-135.636l-90.788 58.956z"
                  style={{
                    fill: "#e1710e",
                  }}
                />
                <path
                  d="M368.556 364.108c6.472-9.968 3.64-23.296-6.328-29.768l-16.044-10.416c9.964 6.476 23.292 3.64 29.768-6.328 6.468-9.964 3.64-23.288-6.328-29.764l-12.032-7.812-.016.028c-21.552-13.98-64.968-42.228-74.184-48.212-17.924-11.644-43.088-25.788-39.112-45.712-48.78-35.876-86.164-15.624-97.236-2.916L130.8 172.66l-61.204 94.248 16.428 10.672c-7.912 19.508 13.8 40.32 21.74 45.476 7.696 5 85.46 55.5 123.976 80.516 9.884 6.416 17.184 11.156 20.052 13.016l12.028 7.82.08-.116c9.672 4.86 21.656 1.772 27.688-7.516s3.976-21.488-4.4-28.344l.08-.116 14.04 9.116c9.968 6.468 23.296 3.64 29.764-6.328 6.472-9.968 3.64-23.292-6.328-29.768l14.04 9.116c9.972 6.456 23.3 3.628 29.772-6.344z"
                  style={{
                    fill: "#f5e8cc",
                  }}
                />
                <path
                  d="m267.908 420.272-.076.116-12.032-7.812c-2.868-1.86-10.168-6.604-20.052-13.024-38.516-25.012-116.28-75.512-123.976-80.512-7.94-5.152-29.652-25.964-21.74-45.48l-16.428-10.664 58.192-89.608-.988-.64L69.6 266.9l16.428 10.672c-7.912 19.508 13.8 40.32 21.74 45.476 7.696 5 85.46 55.5 123.976 80.516 9.884 6.416 17.184 11.156 20.052 13.016l12.032 7.82.076-.116c9.108 4.576 20.208 2.036 26.512-6.024-6.4 4.776-15.12 5.732-22.508 2.012z"
                  style={{
                    fill: "#d5cdb9",
                  }}
                />
                <path
                  d="m305.304 393.416-84.16-54.088c-2.616-1.012-5.68 1.364-2.916 4.084l83.084 54c9.46 6.148 21.888 3.82 28.664-4.952-7.024 5.312-16.86 6.028-24.672.956zM342.936 366.664l-107.8-70.544c-2.616-1.012-5.68 1.364-2.916 4.084l106.72 70.456c9.464 6.148 21.892 3.82 28.672-4.956-7.036 5.32-16.86 6.032-24.676.96zM350.184 320.288l-82.968-54.696c-2.612-1.008-5.68 1.368-2.916 4.088l81.888 54.604c9.464 6.148 21.888 3.82 28.668-4.956-7.028 5.32-16.86 6.032-24.672.96z"
                  style={{
                    fill: "#d5cdb9",
                  }}
                />
                <path
                  d="M84.455 155.501h21.52v121.948h-21.52z"
                  style={{
                    fill: "#a6a6a6",
                  }}
                  transform="rotate(32.997 95.214 216.476)"
                />
                <path
                  d="m.404 241.916 46.048 29.904 79.436-122.324-73.956-48.028C22.008 140.92 3.256 189.296.404 241.916z"
                  style={{
                    fill: "#406a80",
                  }}
                />
                <path
                  d="M246.176 161.116c-14.644-.3-55.592 8.668-65.456 7.772-9.864-.9-35.484 41.96-44.28 52.26-.056.068-.104.148-.16.216-.232.248-.46.448-.692.72-8.164 9.524-22.596 24.568-15.764 35.088 4.528 6.972 12.236 10.608 19.98 10.304l.016.044c.184-.016.384-.04.58-.06a22.717 22.717 0 0 0 7.228-1.712c12.672-4.456 32.568-18.428 54.016-56.512 20.324 15.544 80.1 36.464 136.588-26.6-24.508-12.852-77.408-21.22-92.056-21.52z"
                  style={{
                    fill: "#f4c395",
                  }}
                />
                <path
                  d="m276.84 392.668-6.268-4.076a1.502 1.502 0 0 0-2.068.44l-11.396 17.552a1.498 1.498 0 0 0 .44 2.068l6.264 4.076c5.54 3.592 12.944 2.024 16.54-3.52 3.6-5.54 2.024-12.944-3.512-16.54zM312.708 363.976l-6.268-4.072a1.5 1.5 0 0 0-2.068.436l-11.396 17.548a1.506 1.506 0 0 0 .436 2.072l6.268 4.068c5.536 3.596 12.94 2.028 16.54-3.512 3.592-5.54 2.024-12.944-3.512-16.54zM350.96 337.676l-6.264-4.076a1.51 1.51 0 0 0-2.072.436l-11.396 17.548a1.501 1.501 0 0 0 .44 2.072l6.264 4.072c5.54 3.596 12.94 2.024 16.54-3.516 3.6-5.536 2.028-12.94-3.512-16.536zM362.92 297.028l-6.264-4.072a1.508 1.508 0 0 0-2.072.432l-11.396 17.548a1.504 1.504 0 0 0 .44 2.072l6.264 4.072c5.54 3.596 12.94 2.024 16.54-3.516 3.6-5.536 2.02-12.94-3.512-16.536z"
                  style={{
                    fill: "#fff",
                  }}
                />
              </svg>
            </span>
            <p className="text-center">
              <span className="text-xl font-bold">5</span>/<span className="text-xl">10</span> New Members in the last month
            </p>
          </div>
          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center flex-col items-center min-w-[200px] min-h-[120px]">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" id="Layer_1" width={64} height={64} fill="#000" viewBox="0 0 512 512">
                <g id="SVGRepo_iconCarrier">
                  <style>{".st0{fill:#d3d8d9}.st1{fill:#ededed}.st2{fill:#a8b1b3}.st3{fill:#fff}.st4{fill:#fb8a8a}.st5{fill:#fcb1b1}.st6{fill:#f96363}.st10{fill:#fee8b3}.st22{fill:#333}"}</style>
                  <path d="M320 307.8h30.5v128.8H320zM485.6 436.6h-30.4l-60-128.8h30.5zM275.3 307.8l-59.9 128.8h-30.5l60-128.8z" className="st0" />
                  <path d="M320 307.8h30.5v21.8H320zM435.8 329.6h-30.4l-10.2-21.8h30.5z" className="st1" />
                  <path d="M485.6 436.6h-30.5L445 414.8h30.5zM184.9 436.6h30.5l10.2-21.8h-30.5z" className="st2" />
                  <path d="m275.3 307.8-10.1 21.8h-30.5l10.2-21.8z" className="st1" />
                  <path d="M320 414.8h30.5v21.8H320z" className="st2" />
                  <path d="M178.6 71.7h313.3v201.8H178.6z" className="st3" />
                  <path d="M512 43.4v22.3c0 3.3-2.7 6-6 6H164.5c-3.3 0-6-2.7-6-6V43.4c0-3.3 2.7-6 6-6H506c3.3 0 6 2.7 6 6z" className="st4" />
                  <path d="M512 43.4v10.9c0-3.3-2.7-6-6-6H164.5c-3.3 0-6 2.7-6 6V43.4c0-3.3 2.7-6 6-6H506c3.3 0 6 2.7 6 6z" className="st5" />
                  <path d="M512 54.8v10.9c0 3.3-2.7 6-6 6H164.5c-3.3 0-6-2.7-6-6V54.8c0 3.3 2.7 6 6 6H506c3.3 0 6-2.7 6-6z" className="st6" />
                  <path d="M512 279.5v22.3c0 3.3-2.7 6-6 6H164.5c-3.3 0-6-2.7-6-6v-22.3c0-3.3 2.7-6 6-6H506c3.3 0 6 2.7 6 6z" className="st4" />
                  <path d="M512 279.5v10.9c0-3.3-2.7-6-6-6H164.5c-3.3 0-6 2.7-6 6v-10.9c0-3.3 2.7-6 6-6H506c3.3 0 6 2.7 6 6z" className="st5" />
                  <path d="M512 290.9v10.9c0 3.3-2.7 6-6 6H164.5c-3.3 0-6-2.7-6-6v-10.9c0 3.3 2.7 6 6 6H506c3.3-.1 6-2.7 6-6z" className="st6" />
                  <path
                    d="M0 241.1v81.6c0 14.2 11.5 25.7 25.7 25.7H134V229.7h90c5.9 0 11.3-2.4 15.2-6.3 3.9-3.9 6.3-9.3 6.3-15.2 0-11.9-9.6-21.5-21.5-21.5H54.4C24.3 186.7 0 211.1 0 241.1z"
                    style={{
                      fill: "#ff881a",
                    }}
                  />
                  <path
                    d="M0 241.1V262c0-30 24.3-54.4 54.4-54.4H224c8.1 0 15.1 4.5 18.7 11.1 1.8-3.1 2.8-6.7 2.8-10.5 0-11.9-9.6-21.5-21.5-21.5H54.4c-30 0-54.4 24.4-54.4 54.4z"
                    style={{
                      fill: "#f60",
                    }}
                  />
                  <path
                    d="M0 301.7v21c0 14.2 11.5 25.7 25.7 25.7h10.5v-21H25.7C11.5 327.4 0 315.9 0 301.7z"
                    style={{
                      fill: "#ffcb70",
                    }}
                  />
                  <path d="M36.2 345.6v105.5c0 13 10.5 23.5 23.5 23.5h50.8c13 0 23.5-10.5 23.5-23.5V345.6H36.2z" className="st1" />
                  <path d="M36.2 429.6V451c0 13 10.5 23.5 23.5 23.5h50.8c13 0 23.5-10.5 23.5-23.5v-21.5c0 13-10.5 23.5-23.5 23.5H59.7c-13 .1-23.5-10.4-23.5-23.4z" className="st0" />
                  <path d="m48.6 187 36.5 75.1 36.5-75.1z" className="st3" />
                  <path d="M46.7 95.3v65.2c0 19.7 16 35.7 35.7 35.7 19.7 0 35.7-16 35.7-35.7V95.3H46.7z" className="st10" />
                  <path
                    d="M46.7 95.3H118v43.1H46.7z"
                    style={{
                      fill: "#fff4d9",
                    }}
                  />
                  <path
                    d="M147.6 79 118 123.2H46.7V95.7c0-9.2 7.5-16.7 16.7-16.7h84.2z"
                    style={{
                      fill: "#516468",
                    }}
                  />
                  <path
                    d="m147.6 79-9.4 14H63.4c-9.2 0-16.7 7.6-16.7 16.8V95.7c0-9.2 7.5-16.7 16.7-16.7h84.2z"
                    style={{
                      fill: "#7c8b8d",
                    }}
                  />
                  <path
                    d="M423.8 95.3h38v154.6h-38z"
                    style={{
                      fill: "#7ad1f9",
                    }}
                  />
                  <path
                    d="M349.7 125.8h38v124.1h-38z"
                    style={{
                      fill: "#7bde9e",
                    }}
                  />
                  <path
                    d="M275.7 156.3h38v93.6h-38z"
                    style={{
                      fill: "#fddd8d",
                    }}
                  />
                  <path
                    d="M423.8 95.3h38v19.1h-38z"
                    style={{
                      fill: "#a6e1fb",
                    }}
                  />
                  <path
                    d="M349.7 230.8h38v19.1h-38z"
                    style={{
                      fill: "#50d27e",
                    }}
                  />
                  <path
                    d="M275.7 230.8h38v19.1h-38z"
                    style={{
                      fill: "#fdd267",
                    }}
                  />
                  <ellipse
                    cx={266.7}
                    cy={496}
                    rx={190.7}
                    ry={47.3}
                    style={{
                      opacity: 0.5,
                      fill: "#b8cbcd",
                      enableBackground: "new",
                    }}
                  />
                  <path
                    d="M423.8 230.8h38v19.1h-38z"
                    style={{
                      fill: "#4cc3f7",
                    }}
                  />
                  <path
                    d="M349.7 125.8h38v19.1h-38z"
                    style={{
                      fill: "#a7e9bf",
                    }}
                  />
                  <path d="M275.7 156.3h38v19.1h-38z" className="st10" />
                  <path d="M461.8 254h-38c-2.2 0-4.1-1.8-4.1-4.1V95.3c0-2.2 1.8-4.1 4.1-4.1h38c2.2 0 4.1 1.8 4.1 4.1v154.6c0 2.3-1.9 4.1-4.1 4.1zm-33.9-8.1h29.9V99.3h-29.9v146.6zM387.7 254h-38c-2.2 0-4.1-1.8-4.1-4.1V125.8c0-2.2 1.8-4.1 4.1-4.1h38c2.2 0 4.1 1.8 4.1 4.1v124.1c0 2.3-1.8 4.1-4.1 4.1zm-33.9-8.1h29.9v-116h-29.9v116zM313.6 254h-38c-2.2 0-4.1-1.8-4.1-4.1v-93.6c0-2.2 1.8-4.1 4.1-4.1h38c2.2 0 4.1 1.8 4.1 4.1v93.6c0 2.3-1.8 4.1-4.1 4.1zm-33.9-8.1h29.8v-85.5h-29.8v85.5z" className="st22" />
                  <path
                    d="M502.1 78.6c5.5 0 9.9-4.4 9.9-9.9v-22c0-5.5-4.4-9.9-9.9-9.9H166c-5.4 0-9.9 4.4-9.9 9.9v22c0 5.4 4.4 9.9 9.9 9.9h9.8v105.2h-58.4c4.2-6.2 6.7-13.8 6.7-21.8v-35.5L152.6 84c.8-1.2.9-2.8.2-4.1-.7-1.3-2.1-2.1-3.5-2.1H66.4c-11 0-19.9 8.7-20.4 19.6 0 .2-.1.3-.1.5V162c0 8.2 2.6 15.8 6.9 22.1C23.3 186.5 0 211.2 0 241.4v80.3C0 337.9 13.2 351 29.3 351h6.4v97c0 15 12.2 27.1 27.1 27.1h50c14.9 0 27.1-12.2 27.1-27.1V234.1h35.9v35.1H166c-5.4 0-9.9 4.4-9.9 9.9v22c0 5.4 4.4 9.8 9.9 9.8h72.8L182.4 432c-.6 1.2-.5 2.7.3 3.8.7 1.2 2 1.9 3.4 1.9h30c1.6 0 3-.9 3.6-2.3L277.6 311H315v122.8c0 2.2 1.8 4 4 4h30c2.2 0 4-1.8 4-4V311h37.4l58 124.5c.6 1.4 2 2.3 3.6 2.3h30c1.4 0 2.6-.7 3.4-1.9.7-1.1.8-2.6.2-3.8L429.3 311h72.8c5.5 0 9.9-4.4 9.9-9.8v-22c0-5.4-4.4-9.9-9.9-9.9h-9.8V78.6h9.8zM53.9 98.2c0-6.9 5.6-12.5 12.5-12.5h75.4L118 121.3H53.9V98.2zm0 31.1h62.2V162c0 17.2-14 31.1-31.1 31.1-17.2 0-31.1-14-31.1-31.1v-32.7zm63.4 62.7-29.5 60.8L58.2 192h1.9c6.8 5.6 15.4 9 24.9 9 9.5 0 18.1-3.4 24.9-9h7.4zm-88 150.9c-11.7 0-21.3-9.5-21.3-21.3v-80.3c0-24.6 18-45 41.5-48.8l34.3 70.4v80H43.6v-91.7c0-2.2-1.8-4-4-4s-4 1.8-4 4v91.7h-6.3zM43.6 448v-97.1h40.1v116.2h-21c-10.5.1-19.1-8.5-19.1-19.1zm69.2 19.2h-21V350.9h40.1V448c0 10.6-8.6 19.2-19.1 19.2zm23.1-241c-2.2 0-4 1.8-4 4V343H91.8v-80.1l34.5-71h98.2c9.5 0 17.2 7.7 17.2 17.2 0 9.4-7.6 17.2-17.2 17.2h-88.6zm88.6-42.4h-40.7V78.6h300.5v190.6H183.8v-35.1h40.7c14 0 25.2-11.4 25.2-25.2 0-13.8-11.3-25.1-25.2-25.1zm-11 246h-21.2L247.6 311h21.2l-55.3 118.8zm131.5 0h-22V311h22v118.8zm130.8 0h-21.2L399.3 311h21.2l55.3 118.8zm26.3-152.6c1.1 0 1.9.8 1.9 1.9v22c0 1-.8 1.8-1.9 1.8H166c-1 0-1.9-.8-1.9-1.8v-22c0-1 .8-1.9 1.9-1.9h336.1zM166 70.6c-1 0-1.9-.8-1.9-1.9v-22c0-1.1.8-1.9 1.9-1.9h336.1c1.1 0 1.9.8 1.9 1.9v22c0 1-.8 1.9-1.9 1.9H166z"
                    className="st22"
                  />
                </g>
              </svg>
            </span>
            <p className="text-center">
              <span className="text-xl font-bold">13</span>/<span className="text-xl">20</span> Overall Staff Training Completed
            </p>
          </div>

          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center flex-col items-center min-w-[200px] min-h-[120px]">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width={64} height={64} viewBox="0 0 508 508">
                <path
                  d="M465.75 479.8c7.8 0 14.1-6.3 14.1-14.1V204.8H28.25v260.9c0 7.8 6.3 14.1 14.1 14.1h423.4zM268.15 91.4v-49c0-7.8-6.3-14.1-14.1-14.1s-14.1 6.3-14.1 14.1v49.1c0 7.8 6.3 14.1 14.1 14.1s14.1-6.4 14.1-14.2zM97.55 28.3c-7.8 0-14.1 6.3-14.1 14.1v49.1c0 7.8 6.3 14.1 14.1 14.1s14.1-6.3 14.1-14.1V42.4c0-7.8-6.3-14.1-14.1-14.1zM424.65 91.4v-49c0-7.8-6.3-14.1-14.1-14.1s-14.1 6.3-14.1 14.1v49.1c0 7.8 6.3 14.1 14.1 14.1s14.1-6.4 14.1-14.2z"
                  style={{
                    fill: "#fff5f5",
                  }}
                />
                <path
                  d="M56.45 233v29.3h56.3c7.8 0 14.1 6.3 14.1 14.1s-6.3 14.1-14.1 14.1h-56.3v25.7h28.1c7.8 0 14.1 6.3 14.1 14.1s-6.3 14.1-14.1 14.1h-28.1v107.1h395.1V233H56.45z"
                  style={{
                    fill: "#fff",
                  }}
                />
                <path
                  d="M465.75 52.4h-12.9V42.3c0-23.3-19-42.3-42.3-42.3s-42.3 19-42.3 42.3v10.1h-71.8V42.3C296.35 19 277.35 0 254.05 0s-42.3 19-42.3 42.3v10.1h-71.8V42.3c0-23.3-19-42.3-42.4-42.3s-42.3 19-42.3 42.3v10.1h-12.9c-23.3 0-42.3 19-42.3 42.4v370.9c0 23.3 19 42.3 42.3 42.3h423.3c23.3 0 42.3-19 42.3-42.3V94.8c.1-23.4-18.9-42.4-42.2-42.4zm-69.3-10.1c0-7.8 6.3-14.1 14.1-14.1s14.1 6.3 14.1 14.1v49.1c0 7.8-6.3 14.1-14.1 14.1s-14.1-6.3-14.1-14.1V42.3zm-156.5 0c0-7.8 6.3-14.1 14.1-14.1s14.1 6.3 14.1 14.1v49.1c0 7.8-6.3 14.1-14.1 14.1s-14.1-6.3-14.1-14.1V42.3zm-156.5 0c0-7.8 6.3-14.1 14.1-14.1s14.1 6.3 14.1 14.1v49.1c0 7.8-6.3 14.1-14.1 14.1s-14.1-6.3-14.1-14.1V42.3zm396.4 423.4c0 7.8-6.3 14.1-14.1 14.1H42.35c-7.8 0-14.1-6.3-14.1-14.1V204.8h451.6v260.9zm0-289.1H28.25V94.8c0-7.8 6.3-14.1 14.1-14.1h12.9v10.7c0 23.3 19 42.3 42.3 42.3s42.3-19 42.3-42.3V80.7h71.8v10.7c0 23.3 19 42.3 42.3 42.3s42.3-19 42.3-42.3V80.7h71.8v10.7c0 23.3 19 42.3 42.3 42.3s42.3-19 42.3-42.3V80.7h12.9c7.8 0 14.1 6.3 14.1 14.1v81.8h.2z"
                  style={{
                    fill: "#ff9838",
                  }}
                />
                <path
                  d="M42.35 80.7c-7.8 0-14.1 6.3-14.1 14.1v81.8h451.6V94.8c0-7.8-6.3-14.1-14.1-14.1h-12.9v10.7c0 23.3-19 42.3-42.3 42.3s-42.3-19-42.3-42.3V80.7h-71.8v10.7c0 23.3-19 42.3-42.3 42.3s-42.3-19-42.3-42.3V80.7h-71.8v10.7c0 23.3-19 42.3-42.3 42.3s-42.3-19-42.3-42.3V80.7h-13.1z"
                  style={{
                    fill: "#ffc10d",
                  }}
                />
                <ellipse
                  cx={266.7}
                  cy={496}
                  rx={190.7}
                  ry={47.3}
                  style={{
                    opacity: 0.5,
                    fill: "#b8cbcd",
                    enableBackground: "new",
                  }}
                />
              </svg>
            </span>
            <p className="text-center">❗ Rota is Due To be completed for next week.</p>
          </div>

          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center flex-col items-center min-w-[200px] min-h-[120px]">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width={64} height={64} viewBox="0 0 512 512">
                <path
                  d="M418.09 279.79a24.389 24.389 0 0 1-2.765 1.767c-.768.461-1.536.922-2.305 1.306h-.076c-34.412 16.976-124.435-.076-159.461-10.676-10.447-2.305-25.271-6.529-41.478-12.06-2.996-.999-5.991-1.997-9.064-3.149a262.255 262.255 0 0 1-14.057-5.3c-.307-.153-.614-.23-.922-.384a135.489 135.489 0 0 1-5.914-2.227c-24.119-9.985-47.623-22.045-61.987-34.873-5.838-5.223-10.139-10.6-12.367-15.976-7.988-19.511 13.442-31.186 37.869-38.637l3.226-.922c16.438-4.608 33.643-7.451 43.859-9.371 0 0-28.19-34.181-11.137-50.465 26.116-25.118 63.37-3.918 93.019-15.055.999-.384 1.997-.768 2.996-1.229.307-.154.538-.308.845-.461 13.519-6.759 24.657-24.964 32.568-37.177 4.455-6.836 7.912-11.829 10.139-11.829h.077c.077 0 .153.077.307.077 2.996.768 2.535 11.906 2.996 25.271.461 13.288 1.843 28.958 8.68 38.713 5.761 8.296 14.133 13.903 23.197 18.665 2.842 1.536 5.761 2.919 8.68 4.378 3.61 1.767 7.22 3.457 10.754 5.223 4.839 2.458 9.448 5.147 13.673 8.219.845.615 1.613 1.229 2.457 1.843.768.615 1.536 1.229 2.228 1.92.768.615 1.459 1.229 2.151 1.997.615.615 1.152 1.152 1.69 1.767 2.073 2.381 3.994 4.993 5.53 7.911.384.691.768 1.459 1.075 2.228.461.845.845 1.69 1.152 2.611.537 1.306.999 2.765 1.383 4.225 6.068 22.352-36.255 38.022-36.255 38.022 19.816 17.053 76.656 61.68 47.237 83.648z"
                  style={{
                    fill: "#f1ebd9",
                  }}
                />
                <path
                  d="M421.162 325.416v11.522l-.998 2.996-24.734 76.043c-8.68 10.754-19.28 19.817-31.262 26.577a105.247 105.247 0 0 1-14.825 7.143c-8.296 3.226-17.052 5.53-26.116 6.606-3.38.461-6.836.691-10.292.768H139.879c-3.456-.077-6.913-.307-10.293-.768-9.064-1.076-17.82-3.38-26.193-6.606-5.069-1.997-10.062-4.301-14.748-7.066a111.045 111.045 0 0 1-31.339-26.654l-.307-.845-24.426-75.198-.999-2.996v-11.522c0-7.604.768-15.132 2.15-22.352 1.306-6.606 3.226-13.058 5.608-19.279a96.294 96.294 0 0 1 3.303-7.681c12.444-26.039 34.258-46.701 60.988-56.994 2.151-.845 4.301-1.613 6.452-2.227 1.076-.384 2.151-.692 3.226-.999 2.227-.692 4.455-1.229 6.759-1.69a107.879 107.879 0 0 1 22.429-2.381h167.756c2.458 0 4.916.077 7.297.308a90.01 90.01 0 0 1 13.673 1.766c9.755 1.92 19.126 5.223 27.806 9.525 24.349 12.367 43.706 33.567 53.922 59.376l.076.076c.077.308.231.615.385.922 1.766 4.685 3.303 9.448 4.455 14.287.461 1.613.768 3.303 1.152 4.992 1.384 7.219 2.151 14.747 2.151 22.351z"
                  style={{
                    fill: "#4e3f39",
                  }}
                />
                <path
                  d="M348.883 173.022c.384 3.38-.231 6.99-1.92 10.908-4.302 9.832-15.132 19.356-29.419 28.19-11.061 6.913-24.272 13.365-38.098 19.203-19.894 8.526-41.248 15.746-59.683 21.046-2.842.845-5.531 1.613-8.219 2.381-1.843.461-3.687.999-5.454 1.459-.768.154-1.536.384-2.304.615-.307 0-.538.077-.845.153-5.915 1.536-11.215 2.689-15.746 3.61-30.648 8.526-99.394 20.816-144.559 15.516-14.441-1.613-26.5-5.147-34.027-11.061-31.339-24.503 31.339-71.512 53.307-89.563 0 0-45.473-17.974-38.329-42.016 11.291-38.329 60.988-35.795 81.727-64.291 15.209-20.97 7.605-67.518 14.287-69.13 6.606-1.613 22.659 42.937 46.317 54.536 32.184 15.823 74.891-8.833 103.542 19.894 2.766 2.765 4.378 5.914 5.07 9.294 4.225 18.896-18.358 45.088-18.358 45.088 5.223 1.152 12.136 2.458 19.894 4.225 1.767.384 3.687.768 5.607 1.229 2.304.538 4.609 1.152 6.99 1.766.154 0 .231.077.384.077 11.983 2.996 24.579 6.836 35.103 11.829 10.6 4.916 19.126 10.984 22.813 18.435.922 1.843 1.613 3.764 1.843 5.761.077.308.077.539.077.846z"
                  style={{
                    fill: "#ffe0b8",
                  }}
                />
                <path
                  d="M301.797 88.837c4.685 16.975-14.748 39.558-19.587 44.935 0 .077-.077.077-.077.077-.154.23-.307.307-.461.461-.077.154-.154.23-.231.307-1.844-.538-3.61-1.076-5.376-1.536-7.143-1.997-13.519-3.61-18.358-4.993 0 0 25.962-26.654 20.662-46.01v-.077c13.519-6.99 24.58-25.118 32.414-37.254 4.609-7.067 8.066-12.136 10.293-11.675h.077c3.072.845 2.611 11.752 2.996 25.041.153 2.611.23 5.3.461 7.988-6.452 9.14-14.133 18.204-22.813 22.736z"
                  style={{
                    opacity: 0.03,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M356.862 190.533c-16.243 31.653-104.445 56.658-151.534 65.349a537.08 537.08 0 0 0 27.272 9.537c-13.851-3.598-32.055-9.279-50.686-16.378 47.088-8.692 135.29-33.696 151.534-65.349 12.424-24.189-21.184-40.102-52.143-50.125 33.031 8.913 91.32 26.294 75.557 56.966z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M99.783 511.992H63.605l-2.228-10.907-15.439-74.892-2.535-12.213-14.21-69.207-.998-4.839-7.605-36.87h45.703l5.915 36.87 8.295 51.694 8.142 51.003z"
                  style={{
                    fill: "#ff9500",
                  }}
                />
                <path
                  d="M135.954 512H99.785L72.22 339.948 66.3 303.03h45.744l4.226 36.918z"
                  style={{
                    fill: "#ffbc85",
                  }}
                />
                <path
                  d="M172.123 512h-36.169L116.27 339.948l-4.226-36.918h45.726l2.531 36.918z"
                  style={{
                    fill: "#ff9500",
                  }}
                />
                <path
                  d="M208.311 512h-36.188l-11.822-172.052-2.531-36.918h45.744l.856 36.918z"
                  style={{
                    fill: "#ffbc85",
                  }}
                />
                <path
                  d="m249.258 303.03-.837 36.918L244.48 512h-36.169l-3.941-172.052-.856-36.918z"
                  style={{
                    fill: "#ff9500",
                  }}
                />
                <path
                  d="m295.003 303.03-2.532 36.918L280.649 512H244.48l3.941-172.052.837-36.918z"
                  style={{
                    fill: "#ffbc85",
                  }}
                />
                <path
                  d="m340.747 303.03-4.226 36.918L316.818 512h-36.169l11.822-172.052 2.532-36.918z"
                  style={{
                    fill: "#ff9500",
                  }}
                />
                <path
                  d="m386.492 303.03-5.921 36.918L353.007 512h-36.189l19.703-172.052 4.226-36.918z"
                  style={{
                    fill: "#ffbc85",
                  }}
                />
                <path
                  d="m432.236 303.03-7.615 36.918L389.176 512h-36.169l27.564-172.052 5.921-36.918z"
                  style={{
                    fill: "#ff9500",
                  }}
                />
                <ellipse
                  cx={316.824}
                  cy={205.107}
                  rx={46.322}
                  ry={44.538}
                  style={{
                    fill: "#d63a61",
                  }}
                />
                <path
                  d="M331.04 180.703s35.398-32.907 43.914-35.386v8.847l-30.588 21.049-13.326 5.49zM150.145 159.214c-1.316-.885-3.115-.856-4.389.208l-4.833 4.035c-1.274 1.064-1.617 2.822-.971 4.266.134.301.296.593.519.857a3.673 3.673 0 0 0 5.145.45l4.833-4.035a3.636 3.636 0 0 0 .452-5.123 3.537 3.537 0 0 0-.756-.658z"
                  style={{
                    fill: "#d63a61",
                  }}
                />
                <path
                  d="m149.174 163.48-4.833 4.035c-1.274 1.064-3.072 1.093-4.389.208.134.301.296.593.519.857a3.673 3.673 0 0 0 5.145.45l4.833-4.035a3.636 3.636 0 0 0 .452-5.123 3.595 3.595 0 0 0-.757-.658c.647 1.445.305 3.203-.97 4.266z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M109.498 207.315c-1.849-1.017-3.598-.667-4.185 1.046l-2.224 6.496c-.587 1.713.178 4.24 1.718 6.158a8.63 8.63 0 0 0 1.046 1.114c2.229 1.93 4.632 1.817 5.341-.252l2.224-6.496c.708-2.069-.536-5.341-2.765-7.272a6.504 6.504 0 0 0-1.155-.794z"
                  style={{
                    fill: "#dd933a",
                  }}
                />
                <path
                  d="m111.216 213.473-2.224 6.496c-.586 1.713-2.336 2.063-4.185 1.046a8.63 8.63 0 0 0 1.046 1.114c2.229 1.93 4.632 1.817 5.341-.252l2.224-6.496c.708-2.069-.536-5.341-2.765-7.272a6.546 6.546 0 0 0-1.156-.794c1.542 1.918 2.306 4.445 1.719 6.158z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M192.344 173.232c-.693-1.648-2.232-2.638-3.82-2.279l-6.023 1.361c-1.588.359-2.717 1.952-2.859 3.788-.03.382-.032.771.031 1.166.363 2.291 2.229 3.811 4.148 3.378l6.023-1.361c1.918-.433 3.191-2.663 2.828-4.954a4.757 4.757 0 0 0-.328-1.099z"
                  style={{
                    fill: "#63c0ac",
                  }}
                />
                <path
                  d="m189.484 177.02-6.023 1.361c-1.588.359-3.127-.632-3.82-2.279-.03.382-.032.771.031 1.166.363 2.291 2.229 3.811 4.148 3.378l6.023-1.361c1.918-.433 3.191-2.663 2.828-4.954a4.757 4.757 0 0 0-.328-1.099c-.141 1.836-1.271 3.43-2.859 3.788z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M220.412 105.393c1.277-1.468 1.624-3.507.695-4.979l-3.524-5.587c-.929-1.473-2.838-1.91-4.603-1.217-.367.144-.731.32-1.075.564-2.001 1.421-2.719 4.04-1.597 5.819l3.524 5.587c1.122 1.78 3.678 2.073 5.678.652.345-.245.637-.534.902-.839z"
                  style={{
                    fill: "#63c0ac",
                  }}
                />
                <path
                  d="m215.809 104.176-3.524-5.587c-.929-1.473-.582-3.512.695-4.98-.367.144-.731.32-1.075.564-2.001 1.421-2.719 4.04-1.597 5.819l3.524 5.587c1.122 1.78 3.678 2.073 5.678.652a5.16 5.16 0 0 0 .902-.84c-1.765.694-3.674.258-4.603-1.215z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M255.689 155.457c-.068-2.084-.783-3.926-1.815-4.385l-3.912-1.742c-1.032-.459-2.049.611-2.524 2.453a8.399 8.399 0 0 0-.229 1.233c-.268 2.582.533 5.149 1.779 5.704l3.912 1.742c1.246.555 2.485-1.104 2.753-3.686.046-.445.05-.885.036-1.319z"
                  style={{
                    fill: "#ad509a",
                  }}
                />
                <path
                  d="m253.165 157.91-3.912-1.742c-1.032-.459-1.747-2.301-1.815-4.385a8.399 8.399 0 0 0-.229 1.233c-.268 2.582.533 5.149 1.779 5.704l3.912 1.742c1.246.555 2.485-1.104 2.753-3.686.046-.445.05-.885.036-1.319-.475 1.842-1.492 2.913-2.524 2.453z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M239.096 200.128c-1.554-.679-3.48-.39-4.678.839l-4.544 4.662c-1.198 1.229-1.286 3.006-.361 4.331.192.276.413.539.693.766 1.63 1.319 4.148 1.183 5.595-.302l4.544-4.663c1.447-1.485 1.298-3.779-.332-5.098a4.02 4.02 0 0 0-.917-.535z"
                  style={{
                    fill: "#d63a61",
                  }}
                />
                <path
                  d="m238.735 204.46-4.544 4.662c-1.198 1.229-3.124 1.518-4.678.839.192.276.413.539.693.766 1.63 1.319 4.148 1.183 5.595-.302l4.544-4.663c1.447-1.485 1.298-3.779-.332-5.098a3.998 3.998 0 0 0-.917-.537c.924 1.327.837 3.104-.361 4.333z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M54.253 246.259c-1.268-.882-3.114-.996-4.517-.158l-5.322 3.178c-1.403.838-1.915 2.36-1.384 3.683.11.275.25.545.453.795 1.183 1.451 3.538 1.809 5.233.797l5.321-3.178c1.695-1.012 2.114-3.027.931-4.478a3.453 3.453 0 0 0-.715-.639z"
                  style={{
                    fill: "#d63a61",
                  }}
                />
                <path
                  d="m52.868 249.942-5.322 3.178c-1.403.838-3.249.724-4.517-.158.11.275.25.545.453.795 1.183 1.451 3.538 1.809 5.233.797l5.321-3.178c1.695-1.012 2.114-3.027.931-4.478a3.425 3.425 0 0 0-.716-.638c.532 1.322.02 2.844-1.383 3.682z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M156.153 94.414c-.096-1.906-1.279-3.603-3.001-4.043l-6.533-1.668c-1.723-.44-3.434.519-4.244 2.193a4.65 4.65 0 0 0-.393 1.123c-.469 2.355.849 4.716 2.93 5.248l6.533 1.668c2.081.531 4.168-.961 4.637-3.316.081-.406.091-.808.071-1.205z"
                  style={{
                    fill: "#d63a61",
                  }}
                />
                <path
                  d="m151.909 96.608-6.533-1.668c-1.723-.44-2.905-2.137-3.001-4.043a4.65 4.65 0 0 0-.393 1.123c-.469 2.355.849 4.716 2.93 5.248l6.533 1.668c2.081.531 4.168-.961 4.637-3.316.081-.406.091-.808.071-1.205-.81 1.674-2.522 2.632-4.244 2.193z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M91.386 131.417c-1.372-.966-3.219-.887-4.503.345l-4.871 4.673c-1.284 1.232-1.596 3.224-.898 4.838a4.1 4.1 0 0 0 .552.953c1.361 1.697 3.744 1.867 5.296.378l4.871-4.673c1.551-1.489 1.707-4.095.346-5.791a3.796 3.796 0 0 0-.793-.723z"
                  style={{
                    fill: "#bdd646",
                  }}
                />
                <path
                  d="m90.488 136.255-4.871 4.674c-1.284 1.232-3.131 1.311-4.503.345a4.1 4.1 0 0 0 .552.953c1.361 1.697 3.744 1.867 5.296.378l4.871-4.673c1.551-1.489 1.707-4.095.346-5.791a3.791 3.791 0 0 0-.792-.723c.696 1.613.385 3.605-.899 4.837z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M240.601 271.608c-.638-2.192-2.156-3.589-3.775-3.234l-6.142 1.346c-1.62.355-2.823 2.348-3.036 4.727a8.26 8.26 0 0 0-.013 1.518c.279 3.006 2.108 5.115 4.064 4.686l6.142-1.346c1.956-.429 3.329-3.239 3.05-6.246a7.751 7.751 0 0 0-.29-1.451z"
                  style={{
                    fill: "#dd933a",
                  }}
                />
                <path
                  d="m237.565 276.335-6.142 1.346c-1.619.355-3.137-1.042-3.775-3.234a8.26 8.26 0 0 0-.013 1.518c.279 3.006 2.108 5.115 4.064 4.686l6.142-1.346c1.956-.429 3.329-3.239 3.05-6.246a7.746 7.746 0 0 0-.289-1.452c-.215 2.38-1.418 4.373-3.037 4.728z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M367.504 257.832c-.871-2.342-2.801-3.748-4.79-3.233l-7.544 1.952c-1.989.515-3.402 2.784-3.576 5.397a8.025 8.025 0 0 0 .041 1.658c.458 3.259 2.799 5.417 5.202 4.795l7.544-1.952c2.403-.622 3.994-3.797 3.535-7.056a7.309 7.309 0 0 0-.412-1.561z"
                  style={{
                    fill: "#bdd646",
                  }}
                />
                <path
                  d="m363.928 263.23-7.544 1.952c-1.989.515-3.918-.891-4.79-3.233a8.025 8.025 0 0 0 .041 1.658c.458 3.259 2.799 5.417 5.202 4.795l7.544-1.952c2.403-.622 3.994-3.797 3.535-7.056a7.422 7.422 0 0 0-.412-1.562c-.174 2.613-1.587 4.883-3.576 5.398z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="M307.836 123.504c-.405-1.773-1.418-2.942-2.523-2.717l-4.189.856c-1.105.226-1.947 1.774-2.123 3.666a7.728 7.728 0 0 0-.029 1.212c.151 2.41 1.366 4.159 2.701 3.886l4.189-.856c1.334-.273 2.303-2.468 2.152-4.878a7.151 7.151 0 0 0-.178-1.169z"
                  style={{
                    fill: "#d63a61",
                  }}
                />
                <path
                  d="m305.713 127.17-4.189.856c-1.105.226-2.118-.944-2.523-2.717a7.728 7.728 0 0 0-.029 1.212c.151 2.41 1.366 4.159 2.701 3.886l4.189-.856c1.334-.273 2.303-2.468 2.152-4.878a7.273 7.273 0 0 0-.178-1.17c-.175 1.893-1.018 3.442-2.123 3.667z"
                  style={{
                    opacity: 0.1,
                    fill: "#040000",
                  }}
                />
                <path
                  d="m432.223 303.064-7.604 36.87H28.195l-7.605-36.87z"
                  style={{
                    fill: "#f1ebd9",
                  }}
                />
                <path
                  d="m432.223 303.064-7.604 36.87-35.41 172.058H63.605l-2.227-10.907-15.439-74.891 190.185-190.186 24.195-24.196 10.37-10.369 53.768-53.768 31.876-31.877c2.842 1.536 5.761 2.919 8.68 4.378 3.61 1.767 7.22 3.457 10.754 5.223 4.839 2.458 9.448 5.147 13.673 8.219.845.615 1.613 1.229 2.457 1.843.768.615 1.536 1.229 2.228 1.92.768.615 1.459 1.229 2.151 1.997.615.615 1.152 1.152 1.69 1.767 2.073 2.381 3.994 4.993 5.53 7.911.384.691.768 1.459 1.075 2.228.461.845.845 1.69 1.152 2.611.537 1.306.999 2.765 1.383 4.225 6.068 22.352-36.255 38.022-36.255 38.022 19.818 17.052 76.658 61.68 47.239 83.648a24.389 24.389 0 0 1-2.765 1.767c-.768.384-1.536.845-2.381 1.229v.076h.076c.077.308.231.615.385.922 1.766 4.685 3.303 9.448 4.455 14.287.384 1.69.768 3.303 1.076 4.992h13.287z"
                  style={{
                    opacity: 0.09,
                    fill: "#040000",
                  }}
                />
              </svg>
            </span>
            <p className="text-xl font-bold">Weekly Holidays</p>
            <div ref={holidayRef} className="grid grid-cols-1 shadow-xlp-4">
              {!holiday && <p>Loading holiday..</p>}
              {holiday &&
                weeklyholiday.map((item, index) => {
                  if (item[1]) {
                    return (
                      <div key={index + "a"} className="flex flex-col justify-evenly my-2">
                        <p>{new Date(item[0]).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                        <p>{item[1].date}</p>
                        <span className="border-b-2 border-b-orange-400 flex-1"></span>
                        <p className="text-xl">{item[1].title}</p>
                      </div>
                    );
                  }
                })}
              {holiday && !weeklyholiday.every((item) => item[1]) ? <p className="text-center">No official holiday in the next 7 days.</p> : null}
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2 flex-wrap">
          <p className="text-xl font-bold p-2">Weekly Weather</p>
          <span className={`p-1 rounded-lg `}>Time of weather: </span>
          <span onClick={() => setTimeOfWeather(8)} className={`p-1 rounded-lg ${timeOfWeather == "8" ? "bg-[--c1]" : ""} `}>
            8:00
          </span>
          <span onClick={() => setTimeOfWeather(12)} className={`p-1 rounded-lg ${timeOfWeather == "12" ? "bg-[--c1]" : ""} `}>
            12:00
          </span>
          <span onClick={() => setTimeOfWeather(16)} className={`p-1 rounded-lg ${timeOfWeather == "16" ? "bg-[--c1]" : ""} `}>
            16:00
          </span>
          <span onClick={() => setTimeOfWeather(20)} className={`p-1 rounded-lg ${timeOfWeather == "20" ? "bg-[--c1]" : ""} `}>
            20:00
          </span>
        </div>
        <div className="widget flex-1 px-2 py-4 my-2 shadow-xl flex justify-center">
          <div className="flex flex-wrap p-4 justify-center">
            <div ref={weatherRef}>{!weather && <p>Loading weather..</p>}</div>
            {weeklyWeather &&
              weeklyWeather.forecast.forecastday.map((day, index) => {
                return (
                  <div key={index + "b"} className="grid grid-cols-1 m-2 w-[130px] shadow-xl p-1">
                    <p className="text-center">{new Date(day.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                    <p className="cols col-span-1 text-center  m-0 h-[24px]">{day.date}</p>
                    <span className="border-b-2 border-b-orange-400 flex-1"></span>
                    <div className="h-[80px]">
                      <p className="text-2xl font-bold text-center">{parseFloat(day.hour[timeOfWeather].temp_c).toFixed(1)}&deg;</p>
                      <p title={weather.current?.condition.text} className="line-clamp-2">
                        {day.day.condition.text}
                      </p>
                    </div>
                    <div className=" mt-auto">
                      <p className="flex flex-col">
                        <span className="grid grid-cols-[20px_1fr] gap-1">
                          <TiWeatherCloudy className="text-2xl" /> {day.hour[timeOfWeather].cloud}%
                        </span>
                        <span className="grid grid-cols-[20px_1fr] gap-1">
                          <WiHumidity className="text-2xl" /> {day.hour[timeOfWeather].humidity}%
                        </span>
                        <span className="grid grid-cols-[20px_1fr] gap-1">
                          <FaWind className="text-xl" /> {day.hour[timeOfWeather].wind_mph}mph
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
