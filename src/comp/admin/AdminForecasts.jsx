import React, { useState, useEffect, useRef } from "react";
import { IoMdRefreshCircle } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AdminForecasts = ({ dayForecast, setDayForecast, weeklyForecast, setWeeklyForecast }) => {
  const forecastRef = useRef(null);

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


  return (
    <div className="flex flex-col">
      <p className="text-xl font-bold p-2 underline">-Forecasts-</p>

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

      <p className="text-xl font-bold p-2">Weekly Sales Target</p>
      <div className="flex-1 flex flex-wrap flex-col">
        <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center flex-wrap">
          <div className="shadow-xl p-2 flex flex-col">
            <p className="text-xl text-center">Sunday</p>
            <div className="flex p-2">
              <span>£</span>
              <input type="text" className="text-center bg-gray-50" defaultValue={`1111`} />
            </div>
            <button className="bg-[--c1] p-2 rounded">Update</button>
          </div>
          <div className="shadow-xl p-2 flex flex-col">
            <p className="text-xl text-center">Monday</p>
            <div className="flex p-2">
              <span>£</span>
              <input type="text" className="text-center bg-gray-50" defaultValue={`1111`} />
            </div>
            <button className="bg-[--c1] p-2 rounded">Update</button>
          </div>
          <div className="shadow-xl p-2 flex flex-col">
            <p className="text-xl text-center">Tuesday</p>
            <div className="flex p-2">
              <span>£</span>
              <input type="text" className="text-center bg-gray-50" defaultValue={`1111`} />
            </div>
            <button className="bg-[--c1] p-2 rounded">Update</button>
          </div>
          <div className="shadow-xl p-2 flex flex-col">
            <p className="text-xl text-center">Wednesday</p>
            <div className="flex p-2">
              <span>£</span>
              <input type="text" className="text-center bg-gray-50" defaultValue={`1111`} />
            </div>
            <button className="bg-[--c1] p-2 rounded">Update</button>
          </div>
          <div className="shadow-xl p-2 flex flex-col">
            <p className="text-xl text-center">Thursday</p>
            <div className="flex p-2">
              <span>£</span>
              <input type="text" className="text-center bg-gray-50" defaultValue={`1111`} />
            </div>
            <button className="bg-[--c1] p-2 rounded">Update</button>
          </div>
          <div className="shadow-xl p-2 flex flex-col">
            <p className="text-xl text-center">Friday</p>
            <div className="flex p-2">
              <span>£</span>
              <input type="text" className="text-center bg-gray-50" defaultValue={`1111`} />
            </div>
            <button className="bg-[--c1] p-2 rounded">Update</button>
          </div>
          <div className="shadow-xl p-2 flex flex-col">
            <p className="text-xl text-center">Saturday</p>
            <div className="flex p-2">
              <span>£</span>
              <input type="text" className="text-center bg-gray-50" defaultValue={`1111`} />
            </div>
            <button className="bg-[--c1] p-2 rounded">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForecasts;
