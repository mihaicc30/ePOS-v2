import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import VenueNTable from "../menu/VenueNTable";
import { getTableLayout } from "../../utils/DataTools";
import { getVenueById, getTableTime } from "../../utils/BasketUtils";
import { AiFillCaretRight, AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowUp, AiOutlineArrowRight } from "react-icons/ai";
import { BsArrowsMove } from "react-icons/bs";
import { IoIosResize } from "react-icons/io";
import { GiRoundTable } from "react-icons/gi";
import { LuPersonStanding } from "react-icons/lu";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiCopy } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "./Tables.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tables = ({ setBasketDiscount, basketItems, setBasketItems, tables, setTables, draggingIndex, setDraggingIndex, showArea, setshowArea, uniqueAreas, setuniqueAreas, venues, venueNtable, setVenueNtable }) => {
  const nav = useNavigate();
  const [tableClock, setTableClock] = useState({});

  const [tpCols, setTPCols] = useState(20);
  const [tpRows, setTPRows] = useState(20);
  const [tb, setTB] = useState({});

  useEffect(() => {
    (async () => {
      const tableData = await getTableTime(localStorage.getItem("venueID"));
      setTableClock(tableData);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let query = await getTableLayout();
      setTB(query);
      if (!uniqueAreas.includes(showArea)) return;
      setTimeout(() => {
        const listWithBar = query.gridSize.find(([list]) => list === showArea);
        setTPCols(listWithBar[1]);
        setTPRows(listWithBar[2]);
      }, 200);
    })();
  }, []);

  useEffect(() => {
    if (!tb.gridSize) return;
    const listWithBar = tb.gridSize.find(([list]) => list === showArea);
    setTPCols(listWithBar[1]);
    setTPRows(listWithBar[2]);
  }, [showArea]);

  const setTable = async (tableNumber) => {
    try {
      const utcDate = new Date();
      const options = {
        timeZone: "Europe/London",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const britishTime = new Intl.DateTimeFormat('en-GB', options).format(utcDate);

      const response = await fetch(`${import.meta.env.VITE_API}getTable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          tableNumber,
          venue: localStorage.getItem("venueID"),
          user: { displayName: localStorage.getItem("displayName"), email: localStorage.getItem("email") },
          britishTime
        }),
      });
      const data = await response.json();
      if (response.status == 200) {
        setBasketItems(data.basket);
        setBasketDiscount(data.tableDiscount);
        setVenueNtable((prevValues) => ({ ...prevValues, table: tableNumber }));
        localStorage.setItem("tableID", tableNumber);
        nav("/Menu");
        console.log(`Received table data. Table locked. `);
      } else {
        toast.error(`${data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error fetching:", error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className=" bg-[--c60] flex flex-col gap-4 overflow-y-hidden h-[100%] relative">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
      <div className={` flex w-[100%] flex-col transition-all z-10 mx-auto text-xl whitespace-nowrap select-none relative`}>
        <p className="text-center">{venueNtable.table ? `Current Selected Table: ${venueNtable.table}` : `Select a Table.`}</p>
      </div>

      <div className=" relative h-[100%] bg-[#ffffff6b] flex flex-col overflow-auto">
        <div className={`grid grid-cols-${uniqueAreas.length} h-12 text-xl`}>
          {uniqueAreas.map((area, index) => (
            <button key={crypto.randomUUID()} onClick={() => setshowArea(area)} onTouchStart={() => setshowArea(area)} className={`${showArea === area ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : "bg-[--c1]"} transition border-b-2 border-b-black rounded-xl mx-1 my-1`}>
              {area}
            </button>
          ))}
        </div>

        <div className="relative grow grid border-2 shadow-md" style={{ gridTemplateRows: `repeat(${tpRows},calc(100% / ${tpRows}))`, gridTemplateColumns: `repeat(${tpCols},calc(100% / ${tpCols}))` }}>
          {Object.values(tb).length > 0 &&
            tb.layout.map((table, index) => {
              if (table.area === showArea) {
                if (table.type === "wall") {
                  return (
                    <div key={index + "tL"} className={`relative flex flex-col justify-center mphism bg-none bg-blue-200 items-center  `} style={{ gridColumnStart: `${table.x1}`, gridColumnEnd: `${table.x2}`, gridRowStart: `${table.y1}`, gridRowEnd: `${table.y2}` }}>
                      <div className="flex flex-col justify-center items-center  rounded-xl h-[100%] w-[100%]"></div>
                    </div>
                  );
                } else {
                  return (
                    <div onClick={() => setTable(table.tn)} key={index + "tL"} className={`relative flex rounded-xl flex-col justify-center mphism ${tableClock["t" + table.tn] ? "bg-none bg-orange-200 " : " bg-gray-200 "} items-center  `} style={{ gridColumnStart: `${table.x1}`, gridColumnEnd: `${table.x2}`, gridRowStart: `${table.y1}`, gridRowEnd: `${table.y2}` }}>
                      <div className="flex flex-col justify-center items-center  rounded-xl h-[100%] w-[100%]">
                        {table.type !== "wall" && <span className="whitespace-nowrap">T-{table.tn}</span>}
                        {tableClock["t" + table.tn] && <p className="z-20 inline-flex items-center text-black">{Math.floor((new Date() - new Date().setHours(tableClock["t" + table.tn].split(":")[0], tableClock["t" + table.tn].split(":")[1], 0)) / (1000 * 60))}min</p>}
                      </div>
                    </div>
                  );
                }
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default Tables;