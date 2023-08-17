import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import VenueNTable from "../menu/VenueNTable";
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
  const [seeControlls, setseeControlls] = useState(false);
  const [seeControlls2, setseeControlls2] = useState(false);
  const [seeControlls3, setseeControlls3] = useState(false);
  const areaRef = useRef(null);
  const [tableClock, setTableClock] = useState({});

  useEffect(() => {
    (async () => {
      const tableData = await getTableTime(localStorage.getItem("venueID"));
      setTableClock(tableData);
    })();
  }, []);

  const saveLayout = () => {
    toast.success(`Layout has been saved!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
    console.log(`dev**DB Query to post tables data to the database in venues`);
  };

  const handleDrag = (event, data, id) => {
    if (!seeControlls3) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, x: parseFloat(data.x.toFixed(2)), y: parseFloat(data.y.toFixed(2)) } : table)));
  };

  const setTable = async (tableNumber) => {
    try {
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

  const setTableSeats = (id, seats) => {
    let t = tables.filter((table) => table.id === id);
    if (!t) return;
    if (parseInt(t[0].seats) + parseInt(seats) < 1) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, seats: parseInt(t[0].seats) + parseInt(seats) } : table)));
  };

  const setTableNumber = (id, number) => {
    let t = tables.filter((table) => table.id === id);
    if (!t) return;
    if (parseInt(t[0].tn) + parseInt(number) < 1) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, tn: parseInt(t[0].tn) + parseInt(number) } : table)));
  };

  const setTableHeight = (id, number) => {
    let t = tables.filter((table) => table.id === id);
    if (!t) return;
    if (parseInt(t[0].height) + parseInt(number) < 1 || parseInt(t[0].height) + parseInt(number) > 300) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, height: parseInt(t[0].height) + parseInt(number) } : table)));
  };

  const setTableWidth = (id, number) => {
    let t = tables.filter((table) => table.id === id);
    if (!t) return;
    if (parseInt(t[0].width) + parseInt(number) < 1 || parseInt(t[0].width) + parseInt(number) > 300) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, width: parseInt(t[0].width) + parseInt(number) } : table)));
  };

  const setTableDelete = (id) => {
    let t = tables.filter((table) => table.id === id);
    if (!t) return;
    setTables((prevTables) => prevTables.filter((table) => table.id !== id));
  };

  const setTableCopy = (id) => {
    let newID = crypto.randomUUID();
    let copyElem = tables.filter((table) => table.id === id);
    if (!copyElem[0]) return;
    let newElem = {
      id: crypto.randomUUID(),
      area: copyElem[0].area,
      tn: copyElem[0].tn,
      x: copyElem[0].x + 50,
      y: copyElem[0].y + 50,
      type: copyElem[0].type,
      seats: copyElem[0].seats,
      height: copyElem[0].height,
      width: copyElem[0].width,
    };
    setTables((prevTables) => [...prevTables, newElem]);
  };

  const pushNewElement = (elem) => {
    console.log(areaRef.current.value);
    let newElem = {
      id: crypto.randomUUID(),
      area: areaRef.current.value,
      tn: 0,
      x: 100,
      y: 100,
      type: elem,
      seats: 0,
      height: 110,
      width: elem === "wall" ? 30 : 110,
    };
    setTables((prevTables) => [...prevTables, newElem]);
  };

  return (
    <div className=" bg-[--c60] flex flex-col gap-4 overflow-y-hidden h-[100%] relative">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
      <div className={` flex w-[100%] flex-col transition-all z-10 mx-auto text-xl whitespace-nowrap select-none relative`}>
        <p className="text-center">{venueNtable.table ? `Current Selected Table: ${venueNtable.table}` : `Select a Table.`}</p>
        {localStorage.getItem("isAdmin") === "true" && (
          <button onClick={saveLayout} className="absolute right-0 top-0 bg-[--c1] active:shadow-[inset_2px_2px_2px_black] p-2 text-center border-b-2 border-b-black rounded-xl mx-1">
            Save Layout
          </button>
        )}
      </div>

      <div className=" relative h-[100%] bg-[#ffffff6b] overflow-hidden">
        <div className={`grid grid-cols-${uniqueAreas.length} h-12 text-xl`}>
          {uniqueAreas.map((area, index) => (
            <button key={crypto.randomUUID()} onClick={() => setshowArea(area)} onTouchStart={() => setshowArea(area)} className={`${showArea === area ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : "bg-[--c1]"} transition border-b-2 border-b-black rounded-xl mx-1 my-1`}>
              {area}
            </button>
          ))}
        </div>
        {localStorage.getItem("isAdmin") === "true" && (
          <div className={`grid grid-cols-7 h-12 text-xl relative`}>
            <input ref={areaRef} list="areaslist" type="text" placeholder="Area name.." className="p-2 col-span-2 border-b-2 border-b-black rounded-xl mx-1 my-1" />
            <datalist id="areaslist">
              {uniqueAreas.map((area, index) => (
                <option value={area} key={crypto.randomUUID()}>
                  {area}
                </option>
              ))}
            </datalist>
            <div onClick={() => pushNewElement("table")} className="border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
              Add new table <AiOutlineArrowRight />
            </div>
            <div onClick={() => pushNewElement("wall")} className="border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
              Add new wall <AiOutlineArrowRight />
            </div>
            <div onClick={() => setseeControlls(!seeControlls)} className="border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
              Top Controlls {!seeControlls ? "🔴" : "🟢"}
            </div>
            <div onClick={() => setseeControlls2(!seeControlls2)} className="border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
              Bottom Controlls {!seeControlls2 ? "🔴" : "🟢"}
            </div>
            <div onClick={() => setseeControlls3(!seeControlls3)} className="border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
              Draggable {!seeControlls3 ? "🔴" : "🟢"}
            </div>
          </div>
        )}
        {tables
          .filter((table, index) => table.area === showArea)
          .map((table, index) => {
            if (table.type === "wall") {
              return (
                <Draggable bounds={"#root"} position={draggingIndex === index ? { x: position.x, y: position.y, id: table.id } : { x: table.x, y: table.y, id: table.id }} onDrag={(event, data) => handleDrag(event, data, table.id)} handle=".draggAnchor" key={table.id}>
                  <div style={{ height: `${table.height + 20}px`, width: `${table.width + 20}px` }} className="fixed bg-blue-900 rounded-lg flex justify-center items-center m-auto"></div>
                </Draggable>
              );
            } else {
              let seats = Array.from({ length: table.seats }, (_, index) => index + 1);
              return (
                <Draggable bounds={"#root"} position={draggingIndex === index ? { x: position.x, y: position.y, id: table.id } : { x: table.x, y: table.y, id: table.id }} onDrag={(event, data) => handleDrag(event, data, table.id)} handle=".draggAnchor" key={table.id}>
                  <div style={{ height: `${table.height + 20}px`, width: `${table.width + 20}px` }} onClick={() => setTable(table.tn)} onTouchStart={() => setTable(table.tn)} className="fixed bg-transparent rounded-full flex justify-center items-center m-auto">
                    <div className={`text-white ${tableClock["t" + table.tn] ? "bg-orange-400" : "bg-blue-400"} text-xl draggAnchor relative w-[100%] h-[100%] rounded-[40px] flex flex-col flex-wrap justify-center items-center m-auto`}>
                      <p className="z-20 flex items-center text-black text-2xl my-2">
                        T-
                        {table.tn}
                      </p>
                      {tableClock["t" + table.tn] && <p className="z-20 inline-flex items-center text-black text-2xl">{Math.floor((new Date() - new Date().setHours(tableClock["t" + table.tn].split(":")[0], tableClock["t" + table.tn].split(":")[1],0)) / (1000 * 60))}min</p>}
                    </div>
                  </div>
                </Draggable>
              );
            }
          })}
      </div>
    </div>
  );
};

export default Tables;
