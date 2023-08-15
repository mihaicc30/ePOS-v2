import React, { PureComponent, useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { grabNetProfit } from "../../../utils/DataTools";
import { Brush, LineChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer, Bar, BarChart, Area, ComposedChart } from "recharts";

const NetProfit = () => {
  const [data, setData] = useState("loading");

  useEffect(() => {
    let tempDay = String(new Date().toLocaleDateString('en-GB'));
    (async () => {
      let salesData = await grabNetProfit(tempDay, false, localStorage.getItem("venueID"));
      setData(salesData.data.length < 1 ? [] : salesData.data);
    })();
  }, []);


  const chartData = data !== "loading" ? data.map((item) => ({
    ...item,
    NetProfit: (item.GrossSales - item.OperatingExpenses).toFixed(1),
  })) : "loading";

  const totalOperatingExpenses = data !== "loading" ? data.reduce((sum, item) => sum + item.OperatingExpenses, 0) : "loading";
  const totalGrossSales = data !== "loading" ? data.reduce((sum, item) => sum + item.GrossSales, 0) : "loading";
  const totalNetProfit = data !== "loading" ? data.reduce((sum, item) => sum + (item.GrossSales - item.OperatingExpenses), 0) : "loading";
  return (
    <>
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
              <XAxis dataKey="Time" />
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
            <p className="mx-2">OperatingExpenses: £{(totalOperatingExpenses).toFixed(2)}</p>
            <p className="mx-2">GrossSales: £{(totalGrossSales).toFixed(2)}</p>
            <p className="mx-2">NetProfit: £{(totalNetProfit).toFixed(2)}</p>
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

export default NetProfit;
