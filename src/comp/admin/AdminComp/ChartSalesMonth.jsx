import React, { PureComponent, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Brush, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, Area, ComposedChart } from "recharts";
import { grabSales } from "../../../utils/DataTools";

const ChartSalesMonth = () => {
  const [currentLookedUpDatesMonth, setCurrentLookedUpDatesMonth] = useState(new Date());
  const [data, setData] = useState([]);

  useEffect(() => {
    let tempMonth = String(new Date(currentLookedUpDatesMonth).toLocaleDateString()).substring(2);
    console.log(currentLookedUpDatesMonth);
    (async () => {
      let salesData = await grabSales(false, tempMonth, localStorage.getItem("venueID"));
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

  const totalSales = data && data.length > 0 ? data.reduce((sum, item) => sum + item.Sales, 0) : [];

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mx-4">
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handlePreviousMonth}>
          ◀ Previous
        </button>
        <p className="text-xl col-span-2 bg-gray-100 text-center p-1 rounded-lg shadow-xl border-b-2 border-b-black">
          {currentLookedUpDatesMonth.toLocaleString("default", { month: "long" })} {currentLookedUpDatesMonth.getFullYear()}
          <span className="text-xl px-2 text-center whitespace-nowrap">Gross Sales</span>
        </p>
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handleNextMonth}>
          Next ▶
        </button>
      </div>
      {data.length > 0 ? (
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
              <XAxis dataKey="Date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Sales" fill="#f88f2d" stroke="#8884d8" />
              {/* <Line legendType="none" strokeWidth={2} data={data} dot={false} type="monotone" dataKey="Sales" stroke="#413ea0ae" tooltipType="none" activeDot={{ r: 8 }}/> */}
              <Brush dataKey="Sales" height={30} stroke="#8884d8" travellerWidth={50} />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="flex justify-between gap-6">
            <p>
              {currentLookedUpDatesMonth.toLocaleString("default", { month: "long" })} {currentLookedUpDatesMonth.getFullYear()} Total Gross Sales: £{totalSales}
            </p>
          </div>
        </>
      ) : (
        <div className="h-[100%] flex">
          <p className="my-auto">No recorded sales.</p>
        </div>
      )}
    </>
  );
};

export default ChartSalesMonth;
