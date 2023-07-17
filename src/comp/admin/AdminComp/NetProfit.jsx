import React, { PureComponent } from "react";
import { Brush, LineChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer, Bar, BarChart, Area, ComposedChart } from "recharts";
let data = [
  {
    Time: "12:00",
    OperatingExpenses: 350,
    GrossSales: 0,
    NetProfit: 0,
  },
  {
    Time: "12:30",
    OperatingExpenses: 350,
    GrossSales: 300,
    NetProfit: 0,
  },
  {
    Time: "13:00",
    OperatingExpenses: 550,
    GrossSales: 100,
    NetProfit: 0,
  },
  {
    Time: "13:30",
    OperatingExpenses: 550,
    GrossSales: 400,
    NetProfit: 0,
  },
  {
    Time: "14:00",
    OperatingExpenses: 550,
    GrossSales: 2000,
    NetProfit: 0,
  },
  {
    Time: "14:30",
    OperatingExpenses: 550,
    GrossSales: 50,
    NetProfit: 0,
  },
  {
    Time: "15:00",
    OperatingExpenses: 550,
    GrossSales: 300,
    NetProfit: 0,
  },
  {
    Time: "15:30",
    OperatingExpenses: 350,
    GrossSales: 1400,
    NetProfit: 0,
  },
  {
    Time: "16:00",
    OperatingExpenses: 350,
    GrossSales: 1650,
    NetProfit: 0,
  },
  {
    Time: "16:30",
    OperatingExpenses: 350,
    GrossSales: 100,
    NetProfit: 0,
  },
  {
    Time: "16:30",
    OperatingExpenses: 550,
    GrossSales: 300,
    NetProfit: 0,
  },
  {
    Time: "17:00",
    OperatingExpenses: 550,
    GrossSales: 1300,
    NetProfit: 0,
  },
  {
    Time: "17:30",
    OperatingExpenses: 550,
    GrossSales: 400,
    NetProfit: 0,
  },
  {
    Time: "18:00",
    OperatingExpenses: 550,
    GrossSales: 2000,
    NetProfit: 0,
  },
  {
    Time: "18:30",
    OperatingExpenses: 550,
    GrossSales: 50,
    NetProfit: 0,
  },
  {
    Time: "19:00",
    OperatingExpenses: 550,
    GrossSales: 300,
    NetProfit: 0,
  },
  {
    Time: "19:30",
    OperatingExpenses: 450,
    GrossSales: 1400,
    NetProfit: 0,
  },
  {
    Time: "20:00",
    OperatingExpenses: 450,
    GrossSales: 1650,
    NetProfit: 0,
  },
  {
    Time: "20:30",
    OperatingExpenses: 550,
    GrossSales: 1100,
    NetProfit: 0,
  },
  {
    Time: "21:00",
    OperatingExpenses: 550,
    GrossSales: 1650,
    NetProfit: 0,
  },
  {
    Time: "21:30",
    OperatingExpenses: 350,
    GrossSales: 1200,
    NetProfit: 0,
  },
  {
    Time: "22:00",
    OperatingExpenses: 550,
    GrossSales: 150,
    NetProfit: 0,
  },
];

const NetProfit = () => {
  const chartData = data.map((item) => ({
    ...item,
    NetProfit: item.GrossSales < 1 ? -item.OperatingExpenses : (item.GrossSales - item.OperatingExpenses).toFixed(1),
  }));

  const totalOperatingExpenses = data.reduce((sum, item) => sum + item.OperatingExpenses, 0);
  const totalGrossSales = data.reduce((sum, item) => sum + item.GrossSales, 0);
  const totalNetProfit = data.reduce((sum, item) => sum + (item.GrossSales - item.OperatingExpenses), 0);
  return (
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
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap text-center items-center justify-center">
        <p className="mx-4">Total OperatingExpenses: £{totalOperatingExpenses}</p>
        <p className="mx-4">Total GrossSales: £{totalGrossSales}</p>
        <p className="mx-4">Total NetProfit: £{totalNetProfit}</p>
      </div>
    </>
  );
};

export default NetProfit;
