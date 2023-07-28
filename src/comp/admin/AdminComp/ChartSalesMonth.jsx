import React, { PureComponent, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Brush, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, Area, ComposedChart } from "recharts";

const data = [
  {
    Date: "1/07/2023",
    Sales: 2100,
  },
  {
    Date: "2/07/2023",
    Sales: 3100,
  },
  {
    Date: "3/07/2023",
    Sales: 1100,
  },
  {
    Date: "4/07/2023",
    Sales: 2100,
  },
  {
    Date: "5/07/2023",
    Sales: 2500,
  },
  {
    Date: "6/07/2023",
    Sales: 3100,
  },
  {
    Date: "7/07/2023",
    Sales: 1300,
  },
  {
    Date: "8/07/2023",
    Sales: 2400,
  },
  {
    Date: "9/07/2023",
    Sales: 1300,
  },
  {
    Date: "10/07/2023",
    Sales: 1650,
  },
  {
    Date: "11/07/2023",
    Sales: 1300,
  },
  {
    Date: "12/07/2023",
    Sales: 2000,
  },
  {
    Date: "13/07/2023",
    Sales: 300,
  },
  {
    Date: "14/07/2023",
    Sales: 1450,
  },
  {
    Date: "15/07/2023",
    Sales: 1650,
  },
  {
    Date: "16/07/2023",
    Sales: 1950,
  },
  {
    Date: "17/07/2023",
    Sales: 2900,
  },
  {
    Date: "18/07/2023",
    Sales: 2800,
  },
  {
    Date: "19/07/2023",
    Sales: 1100,
  },
  {
    Date: "20/07/2023",
    Sales: 2500,
  },
  {
    Date: "21/07/2023",
    Sales: 1100,
  },
  {
    Date: "22/07/2023",
    Sales: 2500,
  },
  {
    Date: "23/07/2023",
    Sales: 2700,
  },
  {
    Date: "24/07/2023",
    Sales: 2990,
  },
  {
    Date: "25/07/2023",
    Sales: 1100,
  },
  {
    Date: "26/07/2023",
    Sales: 2100,
  },
  {
    Date: "27/07/2023",
    Sales: 3100,
  },
  {
    Date: "28/07/2023",
    Sales: 4100,
  },
  {
    Date: "29/07/2023",
    Sales: 1100,
  },
  {
    Date: "30/07/2023",
    Sales: 3100,
  },
  {
    Date: "31/07/2023",
    Sales: 2700,
  },
];
const ChartSalesMonth = () => {
  const [currentLookedUpDatesMonth, setCurrentLookedUpDatesMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    let tempDate = new Date(currentLookedUpDatesMonth);
    setCurrentLookedUpDatesMonth(new Date(tempDate.setMonth(tempDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    let tempDate = new Date(currentLookedUpDatesMonth);
    setCurrentLookedUpDatesMonth(new Date(tempDate.setMonth(tempDate.getMonth() + 1)));
  };

  const totalSales = data.reduce((sum, item) => sum + item.Sales, 0);

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
          <Brush dataKey="Sales" height={30} stroke="#8884d8" travellerWidth={50}/>
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-between gap-6">
        <p>{currentLookedUpDatesMonth.toLocaleString("default", { month: "long" })} {currentLookedUpDatesMonth.getFullYear()} Total Gross Sales: £{totalSales}</p>
      </div>
    </>
  );
};

export default ChartSalesMonth;
