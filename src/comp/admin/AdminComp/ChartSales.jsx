import React, { PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, Area, ComposedChart } from "recharts";

const data = [
  {
    Time: "07:00",
    Sales: 0,
  },
  {
    Time: "08:00",
    Sales: 0,
  },
  {
    Time: "09:00",
    Sales: 100,
  },
  {
    Time: "10:00",
    Sales: 0,
  },
  {
    Time: "11:00",
    Sales: 0,
  },
  {
    Time: "12:00",
    Sales: 0,
  },
  {
    Time: "13:00",
    Sales: 1300,
  },
  {
    Time: "14:00",
    Sales: 2000,
  },
  {
    Time: "15:00",
    Sales: 300,
  },
  {
    Time: "16:00",
    Sales: 1650,
  },
  {
    Time: "17:00",
    Sales: 1300,
  },
  {
    Time: "18:00",
    Sales: 2000,
  },
  {
    Time: "19:00",
    Sales: 300,
  },
  {
    Time: "20:00",
    Sales: 1450,
  },
  {
    Time: "21:00",
    Sales: 1650,
  },
  {
    Time: "22:00",
    Sales: 150,
  },
  {
    Time: "23:00",
    Sales: 0,
  },
  {
    Time: "23:59",
    Sales: 0,
  },
];
const ChartSales = () => {


  const totalSales = data.reduce((sum, item) => sum + item.Sales, 0);

  return (
    
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
        <XAxis dataKey="Time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="Sales" fill="#f88f2d" stroke="#8884d8" />
        <Line legendType="none" strokeWidth={2} data={data} dot={false} type="monotone" dataKey="Sales" stroke="#413ea0ae" tooltipType="none" activeDot={{ r: 8 }}/>
      </ComposedChart>
    </ResponsiveContainer>
    
    <div className="flex justify-between gap-6"> 
     <p>Total Sales: £{totalSales}</p>
    </div>
    </>
  );
};

export default ChartSales;
