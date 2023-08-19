import React, { PureComponent, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Brush, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, Area, ComposedChart } from "recharts";
import { grabLabor } from "../../../utils/DataTools";

// const data = [
//   {
//     Date: "1/07/2023",
//     Labor: 1500,
//   },
//   {
//     Date: "2/07/2023",
//     Labor: 1600,
//   },
//   {
//     Date: "3/07/2023",
//     Labor: 500,
//   },
//   {
//     Date: "4/07/2023",
//     Labor: 700,
//   },
//   {
//     Date: "5/07/2023",
//     Labor: 900,
//   },
//   {
//     Date: "6/07/2023",
//     Labor: 1100,
//   },
//   {
//     Date: "7/07/2023",
//     Labor: 1100,
//   },
//   {
//     Date: "8/07/2023",
//     Labor: 1300,
//   },
//   {
//     Date: "9/07/2023",
//     Labor: 1600,
//   },
//   {
//     Date: "10/07/2023",
//     Labor: 500,
//   },
//   {
//     Date: "11/07/2023",
//     Labor: 800,
//   },
//   {
//     Date: "12/07/2023",
//     Labor: 900,
//   },
//   {
//     Date: "13/07/2023",
//     Labor: 800,
//   },
//   {
//     Date: "14/07/2023",
//     Labor: 1100,
//   },
//   {
//     Date: "15/07/2023",
//     Labor: 1300,
//   },
//   {
//     Date: "16/07/2023",
//     Labor: 1500,
//   },
//   {
//     Date: "17/07/2023",
//     Labor: 500,
//   },
//   {
//     Date: "18/07/2023",
//     Labor: 400,
//   },
//   {
//     Date: "19/07/2023",
//     Labor: 700,
//   },
//   {
//     Date: "20/07/2023",
//     Labor: 500,
//   },
//   {
//     Date: "21/07/2023",
//     Labor: 1100,
//   },
//   {
//     Date: "22/07/2023",
//     Labor: 1100,
//   },
//   {
//     Date: "23/07/2023",
//     Labor: 1300,
//   },
//   {
//     Date: "24/07/2023",
//     Labor: 500,
//   },
//   {
//     Date: "25/07/2023",
//     Labor: 800,
//   },
//   {
//     Date: "26/07/2023",
//     Labor: 900,
//   },
//   {
//     Date: "27/07/2023",
//     Labor: 1000,
//   },
//   {
//     Date: "28/07/2023",
//     Labor: 1200,
//   },
//   {
//     Date: "29/07/2023",
//     Labor: 1300,
//   },
//   {
//     Date: "30/07/2023",
//     Labor: 1700,
//   },
//   {
//     Date: "31/07/2023",
//     Labor: 500,
//   },
// ];
const ChartLaborWeek = () => {
  const [data, setData] = useState("loading");
  const [data2, setData2] = useState("loading");
  const [currentLookedUpDatesMonth, setCurrentLookedUpDatesMonth] = useState(new Date());
  const [weekNumber, setWeekNumber] = useState(null);
  const [currentLookedUpDates, setCurrentLookedUpDates] = useState("");
  const [currentYear, setcurrentYear] = useState(new Date().getFullYear());
  const [startWeek, setStartWeek] = useState(null);

  const getWeekNumber = () => {
    setWeekNumber(getCurrentWeekNumber());
    return;
  };

  useEffect(() => {
    getWeekNumber();
  }, []);

  useEffect(() => {
    if (!weekNumber) return;
    const datesOfWeek = getDatesOfWeek(weekNumber, currentYear);
    setCurrentLookedUpDates(datesOfWeek);
  }, [weekNumber]);

  const getCurrentWeekNumber = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() ) / 7);
    return weekNumber;
  };
  const getDatesOfWeek = (weekNumber, year) => {
    const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    setStartWeek(startDate);
    return startDate.toLocaleDateString("en-GB") + " - " + endDate.toLocaleDateString("en-GB");
  };

  const handlePrevious = () => {
    setWeekNumber(weekNumber - 1);
  };

  const handleNext = () => {
    setWeekNumber(weekNumber + 1);
  };

  useEffect(() => {
    (async () => {
      let data = {
        tempWeek: weekNumber,
        venueID: parseInt(localStorage.getItem("venueID")),
      };
      if (!weekNumber) return;
      let laborData = await grabLabor(data);
      if(laborData.message.startsWith("Dont have a ROTA")){
        setData([])
        return
      }
      let tempData = [
        {
          name: "Sunday",
          Actual: laborData.laborPerDay.Sunday.toFixed(2),
          Forecasted: laborData.laborPerDayRoted.Sunday.toFixed(2)
        },
        {
          name: "Monday",
          Actual: laborData.laborPerDay.Monday.toFixed(2),
          Forecasted: laborData.laborPerDayRoted.Monday.toFixed(2)
        },
        {
          name: "Tuesday",
          Actual: laborData.laborPerDay.Tuesday.toFixed(2),
          Forecasted: laborData.laborPerDayRoted.Tuesday.toFixed(2)
        },
        {
          name: "Wednesday",
          Actual: laborData.laborPerDay.Wednesday.toFixed(2),
          Forecasted: laborData.laborPerDayRoted.Wednesday.toFixed(2)
        },
        {
          name: "Thursday",
          Actual: laborData.laborPerDay.Thursday.toFixed(2),
          Forecasted: laborData.laborPerDayRoted.Thursday.toFixed(2)
        },
        {
          name: "Friday",
          Actual: laborData.laborPerDay.Friday.toFixed(2),
          Forecasted: laborData.laborPerDayRoted.Friday.toFixed(2)
        },
        {
          name: "Saturday",
          Actual: laborData.laborPerDay.Saturday.toFixed(2),
          Forecasted: laborData.laborPerDayRoted.Saturday.toFixed(2)
        },
      ];
      setData(tempData);
      setData2(laborData.tempData)
    })();
  }, [weekNumber]);

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mx-4">
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handlePrevious}>
          ◀ Previous
        </button>
        <p className="text-xl col-span-2 bg-gray-100 text-center p-1 rounded-lg shadow-xl border-b-2 border-b-black">
          {currentLookedUpDates}
          <span className="text-xl px-2 text-center whitespace-nowrap">Labor Cost</span>
        </p>
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handleNext}>
          Next ▶
        </button>
      </div>
      <>
        {data === "loading" && (
          <div className="grow z-10 overflow-hidden flex flex-col justify-center items-center bg-transparent ">
            <div className="ui-loader loader-blk">
              <svg viewBox="22 22 44 44" className="multiColor-loader">
                <circle cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" className="loader-circle loader-circle-animation"></circle>
              </svg>
            </div>
          </div>
        )}

        {data.length > 0 && data !== "loading" && (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                width={500}
                height={400}
                data={data}
                margin={{
                  top: 0,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" fill="#63b5ff" stroke="#8884d8" />
                <Bar dataKey="Forecasted" barSize={40} fill="#f88f2dde" />
                <Bar dataKey="Actual" barSize={40} fill="#93c5fd" />
                <Line type="monotone" dataKey="Actual" stroke="#ff7300" legendType="none" tooltipType="none" />
                <Brush dataKey="Actual" height={30} stroke="#8884d8" travellerWidth={50} />
              </ComposedChart>
            </ResponsiveContainer>

            <div className="flex justify-between gap-6">
              <p>Total Labor Cost: £{data2.wages}</p>
              <p>Total Hours: {data2.hours}h</p>
            </div>
          </>
        )}
        {data.length < 1 && data !== "loading" && (
          <div className="h-[100%] w-[100%] overflow-hidden flex">
            <p className="m-auto text-center">No recorded data.</p>
          </div>
        )}
      </>
    </>
  );
};

export default ChartLaborWeek;
