import React, { PureComponent, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts";

const ItemProfitability = ({ modalData }) => {
  // <p>Menu Item Profitability = (Number of Items Sold x Menu Price) – (Number of Items Sold x Item Portion Cost)</p>
  // <p>item sold along the year chart</p>
  let data = [
    {
      name: "January",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "February",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "March",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "April",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "May",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "June",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "July",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "August",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "September",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "October",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "November",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
    {
      name: "December",
      QtySold: parseInt(Math.random() * (99 - 1) + 1),
      Profit: 0,
    },
  ];
  for (let i = 0; i < data.length; i++) {
    data[i].Profit = parseFloat((parseFloat(data[i].QtySold) * parseFloat(modalData.price)).toFixed(2));
  }
  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 relative border-y-2 h-[30vh] py-4 rounded-xl border-black/30">
        <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Product Profitability</span>
        <ResponsiveContainer width="100%" height="100%" className="mt-4 -translate-x-4">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Profit" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="QtySold" stroke="#82ca9d" />
            <Brush dataKey="name" height={30} stroke="#8884d8" travellerWidth={50} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ItemProfitability;
