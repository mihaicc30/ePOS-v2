import React, { PureComponent, useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Brush, Legend, ResponsiveContainer, Bar, BarChart, Area, ComposedChart } from "recharts";
import { grabSales } from "../../../utils/DataTools";


const ChartSales = () => {
  const [data, setData] = useState("loading");

  useEffect(() => {
    let tempDay = String(new Date().toLocaleDateString('en-GB'));
      (async () => {
        let salesData = await grabSales(tempDay, false, localStorage.getItem("venueID"));
        setData(salesData.data.length < 1 ? [] : salesData.data);
      })();
    
  }, []);

  const totalSales = data !== "loading" ? data.reduce((sum, item) => sum + item.Sales, 0) : "loading";

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
              {/* <Line legendType="none" strokeWidth={2} data={data} dot={false} type="monotone" dataKey="Sales" stroke="#413ea0ae" tooltipType="none" activeDot={{ r: 8 }} /> */}
              <Brush dataKey="Sales" height={30} stroke="#8884d8" travellerWidth={50} />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="flex justify-between gap-6">
            <p>Total Sales: £{totalSales.toFixed(2)}</p>
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

export default ChartSales;
