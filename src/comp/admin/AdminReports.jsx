import React, { useState, useEffect, useRef } from "react";
import { IoMdRefreshCircle } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import ChartSalesMonth from "./AdminComp/ChartSalesMonth";
import ChartLaborMonth from "./AdminComp/ChartLaborMonth";
import { getTargets, setTargets } from "../../utils/DataTools";

const AdminReports = ({ weeklyForecast, setWeeklyForecast, weeklyholiday, setWeeklyHoliday, weeklyWeather, setWeeklyWeather }) => {
  const forecastRef = useRef(null);

  const [weekNumber, setWeekNumber] = useState(null);
  const [currentYear, setcurrentYear] = useState(new Date().getFullYear());
  const [currentLookedUpDates, setCurrentLookedUpDates] = useState("");
  const [startWeek, setStartWeek] = useState(null);

  useEffect(() => {
    getWeekNumber();
  }, []);

  useEffect(() => {
    if (!weekNumber) return;
    const datesOfWeek = getDatesOfWeek(weekNumber, currentYear);
    setCurrentLookedUpDates(datesOfWeek);
  }, [weekNumber]);

  useEffect(() => {
    if (!startWeek) return;
    (async () => {
      let tempData = await getTargets(startWeek);
      setCurrentTargets((prev) => ({ ...prev, Monday: parseFloat(tempData.Monday), Tuesday: parseFloat(tempData.Tuesday), Wednesday: parseFloat(tempData.Wednesday), Thursday: parseFloat(tempData.Thursday), Friday: parseFloat(tempData.Friday), Saturday: parseFloat(tempData.Saturday), Sunday: parseFloat(tempData.Sunday) }));
    })();
  }, [startWeek]);

  const getWeekNumber = () => {
    setWeekNumber(getCurrentWeekNumber());
    return;
  };

  const getCurrentWeekNumber = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    return weekNumber;
  };

  const getDatesOfWeek = (weekNumber, year) => {
    const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    setStartWeek(startDate);
    return startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString();
  };

  const getVenueStatus = (day) => {
    if (!day) return <AiOutlineLoading3Quarters className="animate-spin mx-auto text-xl" />;

    if (day > 3000) {
      return <p className="text-center">Busy</p>;
    } else if (day < 2000) {
      return <p className="text-center">Quiet</p>;
    } else {
      return <p className="text-center">Average</p>;
    }
  };

  const [currentTargets, setCurrentTargets] = useState({});

  const handlePrevious = () => {
    setWeekNumber(weekNumber - 1);
  };

  const handleNext = () => {
    setWeekNumber(weekNumber + 1);
  };

  const handleTargetUpdate = async () => {
    const query = await setTargets(startWeek, currentTargets);
    if (query.matchedCount === 1) {
      console.log(`Target saved successfully.`);
    }
  };

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
          cloudy: weeklyWeather.forecast.forecastday[n]?.hour[12].cloud || parseInt(Math.random() * (99 - 1) + 1),
          humidity: weeklyWeather.forecast.forecastday[n]?.hour[12].humidity || parseInt(Math.random() * (99 - 1) + 1),
          windspeed: weeklyWeather.forecast.forecastday[n]?.hour[12].wind_mph || parseInt(Math.random() * (99 - 1) + 1),
          temp: weeklyWeather.forecast.forecastday[n]?.hour[12].temp_c || parseInt(Math.random() * (44 - 1) + 1),
          daytype: dayt,
          isholiday: weeklyholiday[`${n}`]?.title ? 1 : 0,
        };
        // // console.log(`calling forecast api with this data:`, tempz);
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
              date: currentDate.toLocaleDateString(),
              cloudy: weeklyWeather.forecast.forecastday[n]?.hour[12].cloud || parseInt(Math.random() * (99 - 1) + 1),
              humidity: weeklyWeather.forecast.forecastday[n]?.hour[12].humidity || parseInt(Math.random() * (99 - 1) + 1),
              windspeed: weeklyWeather.forecast.forecastday[n]?.hour[12].wind_mph || parseInt(Math.random() * (99 - 1) + 1),
              temp: weeklyWeather.forecast.forecastday[n]?.hour[12].temp_c || parseInt(Math.random() * (44 - 1) + 1),
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

  const [selectedCustomDate, setSelectedCustomDate] = useState(new Date().toISOString().substr(0, 10));

  const handleCustomDateChange = (event) => {
    setSelectedCustomDate(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto relative">
      <p className="text-xl font-bold p-2 underline">Reports</p>

      <div className="flex flex-col gap-4 overflow-y-auto relative">
        <div className="flex flex-col px-4 py-4 shadow-lg">
          <p className="text-xl font-bold p-2">End of day</p>
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4">
            <div className="flex my-3 relative flex-col">
              <span className="absolute -top-3 left-10 bg-gray-50 px-4">Today</span>
              <div className="px-4 pb-4 pt-7 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl flex flex-col">
                <p className="text-center">{new Date(weeklyForecast["0"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                <span className="bg-gray-50 my-1 p-2 text-center border-y-2 border-y-transparent rounded-xl">Date 2/2/22/2/ -2</span>
                <span className="text-center text-lg font-bold">Gross Sales: £2345.67</span>
                <button className="bg-[--c1] mt-auto p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">Generate Today's Report</button>
                <button className=" mt-2 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0 flex flex-nowrap justify-center items-center gap-4">
                  <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-xl rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
                  <span>Regenerate</span>
                </button>
                <button className="bg-[--c1] mt-2 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">View</button>
                <button className="bg-green-400 p-2 mt-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">Download</button>
              </div>
            </div>

            <div className="flex my-3 relative flex-col">
              <span className="absolute -top-3 left-10 bg-gray-50 px-4">Yesterday</span>
              <div className="px-4 pb-4 pt-7 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl flex flex-col">
                <p className="text-center">{new Date(weeklyForecast["0"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                <span className="bg-gray-50 my-1 p-2 text-center border-y-2 border-y-transparent rounded-xl">Date 2/2/22/2/ -2</span>
                <span className="text-center text-lg font-bold">Gross Sales: £2345.67</span>
                <button className="bg-[--c1] p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">View</button>
                <button className="bg-green-400 p-2 mt-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">Download</button>
              </div>
            </div>

            <div className="flex my-3 relative flex-col">
              <span className="absolute -top-3 left-10 bg-gray-50 px-4">Custom</span>
              <div className="px-4 pb-4 pt-7 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl flex flex-col">
                <p className="text-center">{new Date(selectedCustomDate).toLocaleDateString("en-GB", { weekday: "long" })}</p>

                <input type="date" className="bg-gray-50 my-1 p-2 text-center border-y-2 rounded-xl shadow-md" value={selectedCustomDate} onChange={handleCustomDateChange} />
                <span className="text-center text-lg font-bold">Gross Sales: £2345.67</span>
                <button className="bg-[--c1] p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">View</button>
                <button className="bg-green-400 p-2 mt-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">Download</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between px-4">
          <p className="text-xl font-bold p-2">7 Day Forecast</p>
          <button
            onClick={() => {
              reloadWeeklyForecast();
            }}>
            <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-xl rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
          </button>
        </div>

        <div className="flex-1 flex flex-wrap flex-col">
          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="shadow-xl p-3 max-w-[120px]">
                <p className="text-center">{new Date(weeklyForecast["0"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                <p className="text-center"> {weeklyForecast["0"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["0"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["0"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["0"]?.average > 3000 ? "text-green-400" : weeklyForecast["0"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["0"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["0"]?.average)}
              </div>

              <div className="shadow-xl p-3 max-w-[120px]">
                {weeklyForecast["1"]?.date && <p className="text-center">{new Date(weeklyForecast["1"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["1"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["1"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["1"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["1"]?.average > 3000 ? "text-green-400" : weeklyForecast["1"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["1"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["1"]?.average)}
              </div>
              <div className="shadow-xl p-3 max-w-[120px]">
                {weeklyForecast["2"]?.date && <p className="text-center">{new Date(weeklyForecast["2"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["2"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["2"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["2"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["2"]?.average > 3000 ? "text-green-400" : weeklyForecast["2"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["2"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["2"]?.average)}
              </div>

              <div className="shadow-xl p-3 max-w-[120px]">
                {weeklyForecast["3"]?.date && <p className="text-center">{new Date(weeklyForecast["3"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["3"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["3"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["3"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["3"]?.average > 3000 ? "text-green-400" : weeklyForecast["3"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["3"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["3"]?.average)}
              </div>
              <div className="shadow-xl p-3 max-w-[120px]">
                {weeklyForecast["4"]?.date && <p className="text-center">{new Date(weeklyForecast["4"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["4"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["4"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["4"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["4"]?.average > 3000 ? "text-green-400" : weeklyForecast["4"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["4"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["4"]?.average)}
              </div>

              <div className="shadow-xl p-3 max-w-[120px]">
                {weeklyForecast["5"]?.date && <p className="text-center">{new Date(weeklyForecast["5"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["5"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["5"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["5"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["5"]?.average > 3000 ? "text-green-400" : weeklyForecast["5"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["5"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["5"]?.average)}
              </div>

              <div className="shadow-xl p-3 max-w-[120px]">
                {weeklyForecast["6"]?.date && <p className="text-center">{new Date(weeklyForecast["6"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["6"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["6"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["6"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["6"]?.average > 3000 ? "text-green-400" : weeklyForecast["6"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["6"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["6"]?.average)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mx-4">
          <div>
            <p className="text-xl font-bold p-2">Week's Target Sales </p>
            <p className="text-xs">*To be set by general manager/ head office</p>
          </div>
          <button onClick={handleTargetUpdate} className="bg-[--c1] p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
            Update
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mx-4">
          <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handlePrevious}>
            ◀ Previous
          </button>
          <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handleNext}>
            Next ▶
          </button>
          <p className="text-xl col-span-2 bg-gray-100 text-center p-1 rounded-lg shadow-xl border-b-2 border-b-black">{currentLookedUpDates}</p>
        </div>
        {currentTargets && (
          <div className="flex-1 flex flex-wrap flex-col">
            {startWeek && (
              <>
                <div className="widget grid grid-cols-7 p-2 m-1 shadow-xl">
                  <div className="shadow-md p-2 flex flex-col">
                    <p className="text-xl text-center">Sunday</p>
                    <p className="text-xs text-center">{new Date(startWeek).toLocaleDateString()}</p>
                    <div className="flex p-2">
                      <span className="p-1">£</span>
                      <input onChange={(e) => setCurrentTargets((prev) => ({ ...prev, Sunday: parseFloat(e.target.value) }))} type="text" className="bg-gray-50 text-start w-[100%] shadow-md p-1" value={currentTargets.Sunday || 0} />
                    </div>
                  </div>
                  <div className="shadow-md p-2 flex flex-col">
                    <p className="text-xl text-center">Monday</p>
                    <p className="text-xs text-center">{new Date(startWeek.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <div className="flex p-2">
                      <span className="p-1">£</span>
                      <input onChange={(e) => setCurrentTargets((prev) => ({ ...prev, Monday: parseFloat(e.target.value) }))} type="text" className="bg-gray-50 text-start w-[100%] shadow-md p-1" value={currentTargets.Monday || 0} />
                    </div>
                  </div>
                  <div className="shadow-md p-2 flex flex-col">
                    <p className="text-xl text-center">Tuesday</p>
                    <p className="text-xs text-center">{new Date(startWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <div className="flex p-2">
                      <span className="p-1">£</span>
                      <input onChange={(e) => setCurrentTargets((prev) => ({ ...prev, Tuesday: parseFloat(e.target.value) }))} type="text" className="bg-gray-50 text-start w-[100%] shadow-md p-1" value={currentTargets.Tuesday || 0} />
                    </div>
                  </div>
                  <div className="shadow-md p-2 flex flex-col">
                    <p className="text-xl text-center">Wednesday</p>
                    <p className="text-xs text-center">{new Date(startWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <div className="flex p-2">
                      <span className="p-1">£</span>
                      <input onChange={(e) => setCurrentTargets((prev) => ({ ...prev, Wednesday: parseFloat(e.target.value) }))} type="text" className="bg-gray-50 text-start w-[100%] shadow-md p-1" value={currentTargets.Wednesday || 0} />
                    </div>
                  </div>
                  <div className="shadow-md p-2 flex flex-col">
                    <p className="text-xl text-center">Thursday</p>
                    <p className="text-xs text-center">{new Date(startWeek.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <div className="flex p-2">
                      <span className="p-1">£</span>
                      <input onChange={(e) => setCurrentTargets((prev) => ({ ...prev, Thursday: parseFloat(e.target.value) }))} type="text" className="bg-gray-50 text-start w-[100%] shadow-md p-1" value={currentTargets.Thursday || 0} />
                    </div>
                  </div>
                  <div className="shadow-md p-2 flex flex-col">
                    <p className="text-xl text-center">Friday</p>
                    <p className="text-xs text-center">{new Date(startWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <div className="flex p-2">
                      <span className="p-1">£</span>
                      <input onChange={(e) => setCurrentTargets((prev) => ({ ...prev, Friday: parseFloat(e.target.value) }))} type="text" className="bg-gray-50 text-start w-[100%] shadow-md p-1" value={currentTargets.Friday || 0} />
                    </div>
                  </div>
                  <div className="shadow-md p-2 flex flex-col">
                    <p className="text-xl text-center">Saturday</p>
                    <p className="text-xs text-center">{new Date(startWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <div className="flex p-2">
                      <span className="p-1">£</span>
                      <input onChange={(e) => setCurrentTargets((prev) => ({ ...prev, Saturday: parseFloat(e.target.value) }))} type="text" className="bg-gray-50 text-start w-[100%] shadow-md p-1" value={currentTargets.Saturday || 0} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="widget my-3 flex-[1_1_50%] shadow-xl flex justify-center flex-col items-center min-w-[400px] min-h-[400px]">
          <ChartSalesMonth />
        </div>
        <div className="widget flex-[1_1_50%] shadow-xl flex justify-center flex-col items-center min-w-[400px] min-h-[400px]">
          <ChartLaborMonth />
        </div>

        <span className=""></span>
      </div>
    </div>
  );
};

export default AdminReports;
