import React, { PureComponent, useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { grabNetProfit } from "../../../utils/DataTools";
import { Brush, LineChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer, Bar, BarChart, Area, ComposedChart } from "recharts";

const NetProfitMonth = () => {
  const [currentLookedUpDatesMonth, setCurrentLookedUpDatesMonth] = useState(new Date());
  const [data, setData] = useState("loading");

  useEffect(() => {
    let tempMonth = String(new Date(currentLookedUpDatesMonth).toLocaleDateString('en-GB')).substring(2);
    (async () => {
      let salesData = await grabNetProfit(false, tempMonth, localStorage.getItem("venueID"));
      setData(salesData.data.length < 1 ? [] : salesData.data);
    })();
  }, [currentLookedUpDatesMonth]);

  const handlePreviousMonth = () => {
    let tempDate = new Date(currentLookedUpDatesMonth);
    setCurrentLookedUpDatesMonth(new Date(tempDate.setMonth(tempDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    let tempDate = new Date(currentLookedUpDatesMonth);
    setCurrentLookedUpDatesMonth(new Date(tempDate.setMonth(tempDate.getMonth() + 1)));
  };

  const chartData =
    data !== "loading"
      ? data.map((item) => ({
          ...item,
          NetProfit: (item.GrossSales - item.OperatingExpenses).toFixed(1),
        }))
      : "loading";

  const totalOperatingExpenses = data !== "loading" ? data.reduce((sum, item) => sum + item.OperatingExpenses, 0) : "loading";
  const totalGrossSales = data !== "loading" ? data.reduce((sum, item) => sum + item.GrossSales, 0) : "loading";
  const totalNetProfit = data !== "loading" ? data.reduce((sum, item) => sum + (item.GrossSales - item.OperatingExpenses), 0) : "loading";
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mx-4">
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handlePreviousMonth}>
          ◀ Previous
        </button>
        <p className="text-xl col-span-2 bg-gray-100 text-center p-1 rounded-lg shadow-xl border-b-2 border-b-black">
          {currentLookedUpDatesMonth.toLocaleString("default", { month: "long" })} {currentLookedUpDatesMonth.getFullYear()}
          <span className="text-xl px-2 text-center whitespace-nowrap">Net Profit</span>
        </p>
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handleNextMonth}>
          Next ▶
        </button>
      </div>
      {data === "loading" && (
        <div className="grow z-10 overflow-y-scroll flex flex-col justify-center items-center bg-transparent">
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
            <BarChart
              width={500}
              height={400}
              data={chartData}
              stackOffset="sign"
              margin={{
                top: 0,
                right: 20,
                left: 0,
                bottom: 0,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="NetProfit" fill="#413ea0ae" stackId="stack" />
              <Line type="monotone" dataKey="Trendline" stroke="#ff7300" />
              <Brush dataKey="Sales" height={30} stroke="#8884d8" travellerWidth={50} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap text-center items-center justify-center">
            <p className="mx-4">OperatingExpenses: £{totalOperatingExpenses.toFixed(2)}</p>
            <p className="mx-4">GrossSales: £{totalGrossSales.toFixed(2)}</p>
            <p className="mx-4">NetProfit: £{totalNetProfit.toFixed(2)}</p>
          </div>
        </>
      )}
      {data.length < 1 && data !== "loading" && (
        <div className="h-[100%] flex">
          <p className="my-auto">No recorded sales.</p>
        </div>
      )}
    </>
  );
};

export default NetProfitMonth;
