import React, { useState, useEffect, useRef } from "react";
import { IoMdRefreshCircle } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ChartSalesMonth from "./AdminComp/ChartSalesMonth";
import NetProfitMonth from "./AdminComp/NetProfitMonth";
import ChartLaborMonth from "./AdminComp/ChartLaborMonth";
import { getTargets, setTargets, generateEndOfDayReport, grabEndOfDayReport } from "../../utils/DataTools";

const AdminReports = ({ weeklyForecast, setWeeklyForecast, weeklyholiday, setWeeklyHoliday, weeklyWeather, setWeeklyWeather }) => {
  const forecastRef = useRef(null);

  const [weekNumber, setWeekNumber] = useState(null);
  const [currentYear, setcurrentYear] = useState(new Date().getFullYear());
  const [currentLookedUpDates, setCurrentLookedUpDates] = useState("");
  const [startWeek, setStartWeek] = useState(null);

  const [todaysReport, setTodaysReport] = useState(new Date(Date.now()).toISOString().substr(0, 10));
  const [todaysReportData, setTodaysReportData] = useState("loading");

  const [yesterdaysReport, setYesterdaysReport] = useState(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10));
  const [yesterdaysReportData, setYesterdaysReportData] = useState("loading");

  const [selectedCustomDate, setSelectedCustomDate] = useState(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10));
  const [selectedCustomDateData, setSelectedCustomDateData] = useState("loading");

  useEffect(() => {
    getWeekNumber();
    (async () => {
      let rotd = await grabEndOfDayReport(new Date(Date.now()).toLocaleDateString(), localStorage.getItem("venueID"));
      let royd = await grabEndOfDayReport(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(), localStorage.getItem("venueID"));
      let rocd = await grabEndOfDayReport(new Date(selectedCustomDate).toLocaleDateString(), localStorage.getItem("venueID"));
      // report of todays date/ report of yesterdays date/ report of custom date
      if (rotd.message) {
        setTodaysReportData(rotd.data);
      } else {
        setTodaysReportData(rotd.message);
      }
      if (royd.message) {
        setYesterdaysReportData(royd.data);
      } else {
        setYesterdaysReportData(royd.message);
      }
      if (rocd.message) {
        setSelectedCustomDateData(rocd.data);
      } else {
        setSelectedCustomDateData(rocd.message);
      }
    })();
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

  const reloadWeeklyForecast = async () => {
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

  const handleCustomDateChange = (event) => {
    setSelectedCustomDate(event.target.value);
    handleGrabReport("custom", new Date(event.target.value).toLocaleDateString());
  };

  const handleGenerateReport = async (when, day) => {
    if (when === "today") {
      setTodaysReportData("loading");
    } else if (when === "yesterday") {
      setYesterdaysReportData("loading");
    } else if (when === "custom") {
      setSelectedCustomDateData("loading");
    }
    let report = await generateEndOfDayReport(day, localStorage.getItem("venueID"));
    try {
      if (when === "today") {
        setTodaysReportData(report.data);
      } else if (when === "yesterday") {
        setYesterdaysReportData(report.data);
      } else if (when === "custom") {
        setSelectedCustomDateData(report.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGrabReport = async (when, day) => {
    if (when === "today") {
      setTodaysReportData("loading");
    } else if (when === "yesterday") {
      setYesterdaysReportData("loading");
    } else if (when === "custom") {
      setSelectedCustomDateData("loading");
    }
    let report = await grabEndOfDayReport(day, localStorage.getItem("venueID"));
    try {
      if (when === "today") {
        setTodaysReportData(report.data);
      } else if (when === "yesterday") {
        setYesterdaysReportData(report.data);
      } else if (when === "custom") {
        setSelectedCustomDateData(report.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [modalViewReport, setModalViewReport] = useState(false);
  const [modalViewReportData, setModalViewReportData] = useState(null);

  const handleViewReport = (when) => {
    if (when === "today") {
      setModalViewReportData(todaysReportData);
    } else if (when === "yesterday") {
      setModalViewReportData(yesterdaysReportData);
    } else if (when === "custom") {
      setModalViewReportData(selectedCustomDateData);
    }
    setModalViewReport(!modalViewReport);
  };

  const handleDownloadReport = async (when) => {
    console.log("when:", when);
    console.log("dev**to create and download pdf");
  };

  const [ChangeGiven, setChangeGiven] = useState(0);
  useEffect(() => {
    if (!modalViewReportData) return;
    const total = Object.values(modalViewReportData.paymentMethod).reduce((acc, value) => acc + value, 0);
    setChangeGiven(total);
  }, [modalViewReportData]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto relative">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      {modalViewReport && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModalViewReport(!modalViewReport) : null)}>
          <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setModalViewReport(!modalViewReport)}>
              ◀ Cancel
            </button>
            <div className="flex flex-col  ml-auto w-[86%] gap-4 p-2 overflow-y-auto">
              <p className="p-4 text-2xl border-y-2 mb-4 border-y-black/30 font-bold shadow-md rounded-xl"> {modalViewReportData.dateString} </p>

              <div className="flex justify-center flex-col gap-2 py-6 px-2 border-y-2 border-y-black/30 shadow-md rounded-xl relative">
                <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">General Stats</span>
                <div className="flex justify-center gap-4">
                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4">Items Sold</span>
                    <p className="p-4 text-2xl border-y-2 border-y-black/30 font-bold shadow-md rounded-xl"> {modalViewReportData.totalQtySold} </p>
                  </div>
                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4">Total Sales</span>
                    <p className="p-4 text-2xl border-y-2 border-y-black/30 font-bold shadow-md rounded-xl"> £{modalViewReportData.totalAmountSold.toFixed(2)} </p>
                  </div>
                </div>
                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4">Discounted</span>
                    <p className="p-4 text-2xl border-y-2 border-y-black/30 font-bold shadow-md rounded-xl">
                      <span>£{(modalViewReportData.totalAmountSoldNoDiscount - modalViewReportData.totalAmountSold).toFixed(2)} </span>
                      <span className="text-sm font-normal"> / </span>
                      <span className="text-sm font-normal">£{(modalViewReportData.totalAmountSoldNoDiscount).toFixed(2)}</span>
                    </p>
                  </div>

                  <div className="flex my-3 relative flex-col min-w-[220px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-xs">Operating Profit Margin</span>
                    <p className={`p-4 border-y-2 border-y-black/30 shadow-md rounded-xl`}>
                      {/*  1000 == rent + utilities */}
                      <span>£{(modalViewReportData.totalAmountSold - modalViewReportData.cogsTotal - modalViewReportData.totalWages - 1000).toFixed(2)}</span>
                      <span> / </span>
                      <span>{(((modalViewReportData.totalAmountSold - modalViewReportData.cogsTotal - modalViewReportData.totalWages - 1000) / modalViewReportData.totalAmountSold) * 100).toFixed()}%</span>
                    </p>
                  </div>

                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">Gross Profit Margin</span>
                    <p className={`p-4 border-y-2 border-y-black/30 shadow-md rounded-xl`}>
                      <span>£{(modalViewReportData.totalAmountSold - modalViewReportData.cogsTotal).toFixed(2)}</span>
                      <span> / </span>
                      <span>{(((modalViewReportData.totalAmountSold - modalViewReportData.cogsTotal) / modalViewReportData.totalAmountSold) * 100).toFixed()}%</span>
                    </p>
                  </div>

                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4">CoGS</span>
                    <p className={`p-4 border-y-2 border-y-black/30 shadow-md rounded-xl`}>
                      <span>£{(modalViewReportData.cogsTotal).toFixed(2)}</span>
                      <span> / </span>
                      <span>{(100 + ((modalViewReportData.cogsTotal - modalViewReportData.totalAmountSold) / modalViewReportData.totalAmountSold) * 100).toFixed()}%</span>
                    </p>
                  </div>

                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4">Labor Cost</span>
                    <p className={`p-4 border-y-2 border-y-black/30 shadow-md rounded-xl ${(modalViewReportData.totalWages / modalViewReportData.totalAmountSold) * 100 > 30 ? "text-red-400" : "text-green-400"}`}>
                      <span>£{(modalViewReportData.totalAmountSold - modalViewReportData.totalWages).toFixed()}</span>
                      <span> / </span>
                      {((modalViewReportData.totalWages / modalViewReportData.totalAmountSold) * 100).toFixed()}%
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4">Staff</span>
                    <p className="p-4 border-y-2 border-y-black/30 shadow-md rounded-xl">7</p>
                  </div>
                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4">Staff Hours</span>
                    <p className="p-4 border-y-2 border-y-black/30 shadow-md rounded-xl">66.3h</p>
                  </div>
                  <div className="flex my-3 relative flex-col min-w-[180px]">
                    <span className="absolute -top-2 left-5 bg-white rounded-lg px-4">Labor Cost</span>
                    <p className="p-4 border-y-2 border-y-black/30 shadow-md rounded-xl">£{modalViewReportData.totalWages.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 py-6 px-2 border-y-2 border-y-black/30 shadow-md rounded-xl relative">
                <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">Breakdown by payment type - Total Handled : £{ChangeGiven} - Sales: £{modalViewReportData.totalAmountSold.toFixed(2)} - Change: £{(parseFloat(ChangeGiven) - parseFloat(modalViewReportData.totalAmountSold)).toFixed(2)}</span>
                <div className="flex justify-center gap-4 pt-2 flex-wrap">
                  {Object.entries(modalViewReportData.paymentMethod).map((cat, index) => {
                    return (
                      <div className="flex relative flex-col min-w-[150px]" key={crypto.randomUUID()}>
                        <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 capitalize">{cat[0]}</span>
                        <p className="p-2 border-y-2 border-y-black/30 shadow-md rounded-xl text-lg">£{cat[1].toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-2 py-6 px-2 border-y-2 border-y-black/30 shadow-md rounded-xl relative">
                <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">Breakdown by category</span>
                <div className="flex justify-center gap-4 flex-wrap">
                  {Object.entries(modalViewReportData.totalSoldCategory)
                    .sort((a, b) => b[1].totalPrice - a[1].totalPrice)
                    .map((cat, index) => {
                      return (
                        <div className="flex relative flex-col min-w-[220px]" key={crypto.randomUUID()}>
                          <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">{index === 0 ? "🥇" : ""} </span>
                          <p className="p-2 border-y-2 border-y-black/30 shadow-md rounded-xl">
                            {cat[1].qty} x {cat[0]} - £{(cat[1].totalPrice).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-center gap-2 py-6 px-2 my-2 border-y-2 border-y-black/30 shadow-md rounded-xl relative">
                <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">Breakdown by subcategory</span>
                <div className="flex justify-center gap-2 flex-wrap">
                  {Object.entries(modalViewReportData.totalSoldSubcategory)
                    .sort((a, b) => b[1].totalPrice - a[1].totalPrice)
                    .map((cat, index) => {
                      return (
                        <div className="flex my-1 relative flex-col min-w-[220px]" key={crypto.randomUUID()}>
                           
                          {index === 0 ? <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">🥇</span>: ""} 
                          
                          <p className="p-2 border-y-2 border-y-black/30 shadow-md rounded-xl">
                            {cat[1].qty} x {cat[0]} - £{(cat[1].totalPrice).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-center gap-2 py-6 px-2 my-2 border-y-2 border-y-black/30 shadow-md rounded-xl relative">
                <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">Breakdown by product</span>
                <div className="gap-4 grid grid-cols-2 whitespace-nowrap w-[100%]">
                  {Object.entries(modalViewReportData.totalSoldProducts)
                    .sort((a, b) => b[1].totalPrice - a[1].totalPrice)
                    .map((cat, index) => {
                      return (
                        <div className="flex my-1 relative flex-col min-w-[220px]" key={crypto.randomUUID()}>
                          <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">
                          {index === 0 ? "🥇" : ""} {cat[1].qty} x £{(cat[1].totalPrice / cat[1].qty).toFixed(2)} = £{cat[1].totalPrice.toFixed(2)}
                          </span>
                          <p className="p-2 border-y-2 border-y-black/30 shadow-md rounded-xl text-ellipsis overflow-hidden">{cat[0]}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="flex justify-center gap-2 py-6 px-2 my-2 border-y-2 border-y-black/30 shadow-md rounded-xl relative">
                <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">Breakdown by seller</span>
                <div className="gap-4 grid grid-cols-2 whitespace-nowrap w-[100%]">
                  {Object.entries(modalViewReportData.totalSoldUsers)
                    .sort((a, b) => b[1] - a[1])
                    .map((cat, index) => {
                      return (
                        <div className="flex my-1 relative flex-col min-w-[220px]" key={crypto.randomUUID()}>
                          <span className="absolute -top-2 left-5 bg-white rounded-lg px-4 text-sm">
                         {index === 0 ? "🥇" : ""}
                          </span>
                          <p className="p-2 border-y-2 border-y-black/30 shadow-md rounded-xl text-ellipsis overflow-hidden">£{cat[1].toFixed(2)} {cat[0]}</p>
                        </div>
                      );
                    })}
                </div>
              </div>


            </div>
          </div>
        </div>
      )}
      <p className="text-xl font-bold p-2 underline">Reports</p>

      <div className="flex flex-col gap-4 overflow-y-auto relative">
        <div className="flex flex-col px-4 py-4 shadow-md">
          <p className="text-xl font-bold p-2">End of day</p>
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4">
            <div className="flex my-3 relative flex-col min-h-[270px]">
              <span className="absolute -top-3 left-5 bg-gray-50 px-4">Today</span>
              <div className="px-4 pb-4 pt-7 text-lg border-y-2 border-y-black/30 shadow-md rounded-xl flex flex-col  h-[100%]">
                <p className="text-center">{new Date(todaysReport).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                <span className="bg-gray-50 my-1 p-2 text-center border-y-2 border-y-transparent rounded-xl">{new Date(todaysReport).toLocaleDateString()}</span>
                {todaysReportData && todaysReportData !== "loading" && (
                  <div className="flex flex-col">
                    <button onClick={() => handleGenerateReport("today", new Date(Date.now()).toLocaleDateString())} className="absolute top-0 right-0 mt-2 p-2 rounded-lg mx-auto active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0 flex flex-nowrap justify-center items-center gap-4">
                      <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-lg rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
                    </button>
                    <span className="text-center text-lg font-bold animate-fadeUP1">Gross Sales: £{parseFloat(todaysReportData.totalAmountSold).toFixed(2)}</span>
                    <button onClick={() => handleViewReport("today")} className="bg-[--c1] mt-2 p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                      View
                    </button>
                    <button onClick={() => handleDownloadReport("today")} className="bg-green-400 p-2 mt-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                      Download
                    </button>
                  </div>
                )}
                {!todaysReportData && todaysReportData !== "loading" && (
                  <>
                    <p className="text-center my-2 transition animate-fadeUP1">Can not generate a report.</p>
                    <button className="bg-[--c1] mt-auto p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={() => handleGenerateReport("today", new Date(Date.now()).toLocaleDateString())}>
                      Generate Today's Report
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex my-3 relative flex-col min-h-[270px]">
              <span className="absolute -top-3 left-5 bg-gray-50 px-4">Yesterday</span>
              <div className="px-4 pb-4 pt-7 text-lg border-y-2 border-y-black/30 shadow-md rounded-xl flex flex-col  h-[100%] ">
                <p className="text-center">{new Date(yesterdaysReport).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                <span className="bg-gray-50 my-1 p-2 text-center border-y-2 border-y-transparent rounded-xl">{new Date(yesterdaysReport).toLocaleDateString()}</span>
                {yesterdaysReportData && yesterdaysReportData !== "loading" && (
                  <div className="flex flex-col  transition">
                    <button onClick={() => handleGenerateReport("yesterday", new Date(yesterdaysReport).toLocaleDateString())} className="absolute top-0 right-0 mt-2 p-2 rounded-lg mx-auto active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0 flex flex-nowrap justify-center items-center gap-4">
                      <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-lg rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
                    </button>
                    <span className="text-center text-lg font-bold animate-fadeUP1">Gross Sales: £{parseFloat(yesterdaysReportData.totalAmountSold).toFixed(2)}</span>
                    <button onClick={() => handleViewReport("yesterday")} className="bg-[--c1] mt-2 p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                      View
                    </button>
                    <button onClick={() => handleDownloadReport("today")} className="bg-green-400 p-2 mt-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                      Download
                    </button>
                  </div>
                )}
                {!yesterdaysReportData && yesterdaysReportData !== "loading" && (
                  <>
                    <p className="text-center my-2  transition animate-fadeUP1">Can not generate a report.</p>
                    <button className="bg-[--c1] mt-auto p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={() => handleGenerateReport("yesterday", new Date(yesterdaysReport).toLocaleDateString())}>
                      Generate Today's Report
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex my-3 relative flex-col min-h-[270px]">
              <span className="absolute -top-3 left-5 bg-gray-50 px-4">Custom</span>
              <div className="px-4 pb-4 pt-7 text-lg border-y-2 border-y-black/30 shadow-md rounded-xl flex flex-col  h-[100%]">
                <p className="text-center">{new Date(selectedCustomDate).toLocaleDateString("en-GB", { weekday: "long" })}</p>

                <input type="date" className="select-none bg-gray-50 my-1 p-2 text-center border-y-2 rounded-xl shadow-md" value={selectedCustomDate} onChange={handleCustomDateChange} />

                {selectedCustomDateData && selectedCustomDateData !== "loading" && (
                  <div className="flex flex-col">
                    <button onClick={() => handleGenerateReport("custom", new Date(selectedCustomDate).toLocaleDateString())} className="absolute top-0 right-0 mt-2 p-2 rounded-lg mx-auto active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0 flex flex-nowrap justify-center items-center gap-4">
                      <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-lg rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
                    </button>
                    <span className="text-center text-lg font-bold transition animate-fadeUP1">Gross Sales: £{parseFloat(selectedCustomDateData.totalAmountSold).toFixed(2)}</span>
                    <button onClick={() => handleViewReport("custom")} className="bg-[--c1] mt-2 p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                      View
                    </button>
                    <button onClick={() => handleDownloadReport("today")} className="bg-green-400 p-2 mt-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                      Download
                    </button>
                  </div>
                )}
                {!selectedCustomDateData && selectedCustomDateData !== "loading" && (
                  <>
                    <p className="text-center my-2 transition animate-fadeUP1">Can not generate a report.</p>
                    <button className="bg-[--c1] mt-auto p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={() => handleGenerateReport("custom", new Date(selectedCustomDate).toLocaleDateString())}>
                      Generate {new Date(selectedCustomDate).toLocaleDateString()} Report
                    </button>
                  </>
                )}
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
            <IoMdRefreshCircle className="text-5xl ml-3 fill-[--c1] shadow-lg rounded-full border-t-[#ccc] border-t-2 border-b-gray-300 border-b-4 active:shadow-inner transition" />
          </button>
        </div>

        <div className="flex-1 flex flex-wrap flex-col">
          <div className="widget flex-1 p-2 m-1 shadow-lg flex justify-center">
            <div className="grid grid-cols-7 gap-4 w-[100%]">
              <div className="shadow-lg p-3">
                <p className="text-center">{new Date(weeklyForecast["0"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>
                <p className="text-center"> {weeklyForecast["0"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["0"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["0"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["0"]?.average > 3000 ? "text-green-400" : weeklyForecast["0"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["0"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["0"]?.average)}
              </div>

              <div className="shadow-lg p-3">
                {weeklyForecast["1"]?.date && <p className="text-center">{new Date(weeklyForecast["1"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["1"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["1"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["1"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["1"]?.average > 3000 ? "text-green-400" : weeklyForecast["1"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["1"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["1"]?.average)}
              </div>
              <div className="shadow-lg p-3">
                {weeklyForecast["2"]?.date && <p className="text-center">{new Date(weeklyForecast["2"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["2"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["2"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["2"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["2"]?.average > 3000 ? "text-green-400" : weeklyForecast["2"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["2"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["2"]?.average)}
              </div>

              <div className="shadow-lg p-3">
                {weeklyForecast["3"]?.date && <p className="text-center">{new Date(weeklyForecast["3"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["3"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["3"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["3"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["3"]?.average > 3000 ? "text-green-400" : weeklyForecast["3"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["3"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["3"]?.average)}
              </div>
              <div className="shadow-lg p-3">
                {weeklyForecast["4"]?.date && <p className="text-center">{new Date(weeklyForecast["4"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["4"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["4"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["4"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["4"]?.average > 3000 ? "text-green-400" : weeklyForecast["4"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["4"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["4"]?.average)}
              </div>

              <div className="shadow-lg p-3">
                {weeklyForecast["5"]?.date && <p className="text-center">{new Date(weeklyForecast["5"]?.date).toLocaleDateString("en-GB", { weekday: "long" })}</p>}
                <p className="text-center"> {weeklyForecast["5"]?.date}</p>
                <p className="text-center">Forecast</p>
                <div className="text-center">
                  {!weeklyForecast["5"]?.date && <p className="text-center">Loading forecast..</p>}
                  {weeklyForecast["5"]?.date && <p className={`text-center font-[600] text-xl ${weeklyForecast["5"]?.average > 3000 ? "text-green-400" : weeklyForecast["5"]?.average < 2000 ? "text-red-400" : "text-yellow-500"} `}>£{weeklyForecast["5"]?.average}</p>}
                </div>
                {getVenueStatus(weeklyForecast["5"]?.average)}
              </div>

              <div className="shadow-lg p-3">
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
          <button onClick={handleTargetUpdate} className="bg-[--c1] p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
            Update
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mx-4">
          <button className="bg-gray-200 p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handlePrevious}>
            ◀ Previous
          </button>
          <button className="bg-gray-200 p-2 rounded-lg shadow-lg border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handleNext}>
            Next ▶
          </button>
          <p className="text-xl col-span-2 bg-gray-100 text-center p-1 rounded-lg shadow-lg border-b-2 border-b-black">{currentLookedUpDates}</p>
        </div>
        {currentTargets && (
          <div className="flex-1 flex flex-wrap flex-col">
            {startWeek && (
              <>
                <div className="widget grid grid-cols-7 p-2 m-1 shadow-lg">
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

        <div className="widget my-3 flex-[1_1_50%] shadow-lg flex justify-center flex-col items-center min-w-[400px] min-h-[400px]">
          <ChartSalesMonth />
        </div>
        <div className="widget my-3 flex-[1_1_50%] shadow-lg flex justify-center flex-col items-center min-w-[400px] min-h-[400px]">
          <NetProfitMonth />
        </div>
        <div className="widget flex-[1_1_50%] shadow-lg flex justify-center flex-col items-center min-w-[400px] min-h-[400px]">
          <ChartLaborMonth />
        </div>

        <span className=""></span>
      </div>
    </div>
  );
};

export default AdminReports;
