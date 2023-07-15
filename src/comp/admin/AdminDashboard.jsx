import React, { useState, useEffect, useRef } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdRefreshCircle } from "react-icons/io";
import { TiWeatherCloudy } from "react-icons/ti";
import { WiHumidity } from "react-icons/wi";
import { FaRegUserCircle, FaWind } from "react-icons/fa";

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
    let dayt;
    let tempdayt = new Date().getDay() + n;
    if (tempdayt > 6) {
      dayt = new Date().getDay() + n - new Date().getDay();
    }
    setTimeout(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}forecast-quick`, {
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
            daytype: new Date().getDay() + n > 6 ? "" : "",
            isholiday: holiday[1]?.title ? 1 : 0,
          }),
        });
        const data = await response.json();
        console.log(data);

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

    for (let i = 1; i < 7; i++) {
      fetchForecastWeek(i);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-bold p-2 underline">-Dashboard-</p>

      <p className="text-xl font-bold p-2">General Info</p>
      <div className="flex-1 flex flex-wrap">
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
          <p>
            <span className="text-xl font-bold">5</span> Days until payday
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
          <p>
            <span className="text-xl font-bold">5</span>/<span className="text-xl">10</span> New Members in the last month
          </p>
        </div>
      </div>

      <p className="text-xl font-bold p-2">Weekly Forecast</p>
      <div className="flex-1 flex flex-wrap flex-col">
        <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center">
          <div className="flex flex-wrap justify-center items-center gap-4">
            {dayForecast && (
              <button
                onClick={() => {
                  setDayForecast(false);
                  fetchForecast();
                  reloadWeeklyForecast();
                }}>
                <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-xl rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
              </button>
            )}
            <div className="shadow-xl p-3">
              {dayForecast && <p className="text-center">{new Date().toISOString().split("T")[0]}</p>}
              {dayForecast && <p className="text-center">Forecast</p>}
              <div ref={forecastRef} className="text-center">
                {!dayForecast && <p className="text-center">Loading forecast..</p>}
                {dayForecast && <p className={`text-center font-[600] text-xl ${dayForecast > 5000 ? "text-green-400" : dayForecast < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{dayForecast}</p>}
              </div>
              {getVenueStatus(dayForecast)}
            </div>

            <div className="shadow-xl p-3">
              <p className="text-center"> {weeklyForecast["1"]?.date}</p>
              {dayForecast && <p className="text-center">Forecast</p>}
              <div className="text-center">
                {!weeklyForecast["1"]?.date && <p className="text-center">Loading forecast..</p>}
                {weeklyForecast["1"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["1"]?.average > 5000 ? "text-green-400" : weeklyForecast["1"]?.average < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["1"]?.average}</p>}
              </div>
              {getVenueStatus(weeklyForecast["1"]?.average)}
            </div>
            <div className="shadow-xl p-3">
              <p className="text-center"> {weeklyForecast["2"]?.date}</p>
              {dayForecast && <p className="text-center">Forecast</p>}
              <div className="text-center">
                {!weeklyForecast["2"]?.date && <p className="text-center">Loading forecast..</p>}
                {weeklyForecast["2"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["2"]?.average > 5000 ? "text-green-400" : weeklyForecast["2"]?.average < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["2"]?.average}</p>}
              </div>
              {getVenueStatus(weeklyForecast["2"]?.average)}
            </div>

            <div className="shadow-xl p-3">
              <p className="text-center"> {weeklyForecast["3"]?.date}</p>
              {dayForecast && <p className="text-center">Forecast</p>}
              <div className="text-center">
                {!weeklyForecast["3"]?.date && <p className="text-center">Loading forecast..</p>}
                {weeklyForecast["3"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["3"]?.average > 5000 ? "text-green-400" : weeklyForecast["3"]?.average < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["3"]?.average}</p>}
              </div>
              {getVenueStatus(weeklyForecast["3"]?.average)}
            </div>
            <div className="shadow-xl p-3">
              <p className="text-center"> {weeklyForecast["4"]?.date}</p>
              {dayForecast && <p className="text-center">Forecast</p>}
              <div className="text-center">
                {!weeklyForecast["4"]?.date && <p className="text-center">Loading forecast..</p>}
                {weeklyForecast["4"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["4"]?.average > 5000 ? "text-green-400" : weeklyForecast["4"]?.average < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["4"]?.average}</p>}
              </div>
              {getVenueStatus(weeklyForecast["4"]?.average)}
            </div>

            <div className="shadow-xl p-3">
              <p className="text-center"> {weeklyForecast["5"]?.date}</p>
              {dayForecast && <p className="text-center">Forecast</p>}
              <div className="text-center">
                {!weeklyForecast["5"]?.date && <p className="text-center">Loading forecast..</p>}
                {weeklyForecast["5"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["5"]?.average > 5000 ? "text-green-400" : weeklyForecast["5"]?.average < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["5"]?.average}</p>}
              </div>
              {getVenueStatus(weeklyForecast["5"]?.average)}
            </div>

            <div className="shadow-xl p-3">
              <p className="text-center"> {weeklyForecast["6"]?.date}</p>
              {dayForecast && <p className="text-center">Forecast</p>}
              <div className="text-center">
                {!weeklyForecast["6"]?.date && <p className="text-center">Loading forecast..</p>}
                {weeklyForecast["6"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["6"]?.average > 5000 ? "text-green-400" : weeklyForecast["6"]?.average < 1500 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["6"]?.average}</p>}
              </div>
              {getVenueStatus(weeklyForecast["6"]?.average)}
            </div>
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
        <div className="flex flex-wrap">
          <div ref={weatherRef}>{!weather && <p>Loading weather..</p>}</div>
          {weeklyWeather &&
            weeklyWeather.forecast.forecastday.map((day, index) => {
              return (
                <div key={index + "b"} className="grid grid-cols-1 m-2 w-[130px] shadow-xl p-1">
                  <p className="cols col-span-1 text-center underline m-0 h-[24px]">{day.date}</p>
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

      <p className="text-xl font-bold p-2">Weekly Holidays</p>
      <div className="widget flex-1 px-2 py-4 my-2 flex justify-center">
        <div ref={holidayRef} className="flex flex-wrap justify-center shadow-xl items-center gap-4">
          {!holiday && <p>Loading holiday..</p>}
          {holiday && (
            <div className="flex flex-col justify-evenly h-[100%] shadow-xl p-2">
              <p className="text-center underline">{holiday[0]}</p>
              {holiday[1]?.title ? <p className="text-xl">{holiday[1].title}</p> : "No events."}
            </div>
          )}

          {holiday &&
            weeklyholiday.map((day, index) => {
              if (index > 0)
                return (
                  <div key={index + "a"} className="flex flex-col justify-evenly h-[100%] shadow-xl p-2">
                    <p className="underline text-center">{day[0]}</p>
                    {day[1]?.title ? <p className="text-xl">{day[1].title}</p> : "No events."}
                  </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
