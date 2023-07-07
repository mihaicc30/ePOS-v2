import React, { useState, useEffect } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import VenueNTable from "../menu/VenueNTable";
import { getVenueById } from "../../utils/BasketUtils";
import { AiFillCaretRight, AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowUp, AiOutlineArrowRight } from "react-icons/ai";
import { BsArrowsMove } from "react-icons/bs";
import { CiHashtag } from "react-icons/ci";
import { IoIosResize } from "react-icons/io";
import { LuPersonStanding } from "react-icons/lu";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./Tables.css";

const Tables = ({ tables, setTables, draggingIndex, setDraggingIndex, showArea, setshowArea, uniqueAreas, setuniqueAreas, venues, venueNtable, setVenueNtable }) => {
  useEffect(() => {}, [tables]);

  const nav = useNavigate();

  const handleDrag = (event, data, id) => {
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, x: parseFloat(data.x.toFixed(2)), y: parseFloat(data.y.toFixed(2)) } : table)));
  };

  const setTable = (tableNumber) => {
    setVenueNtable((prevValues) => ({ ...prevValues, table: tableNumber }));
  };

  const setTableSeats = (id, seats) => {
    let t = tables.filter((table) => table.id === id);
    if (parseInt(t[0].seats) + parseInt(seats) < 1) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, seats: parseInt(t[0].seats) + parseInt(seats) } : table)));
  };

  const setTableNumber = (id, number) => {
    let t = tables.filter((table) => table.id === id);
    if (parseInt(t[0].tn) + parseInt(number) < 1) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, tn: parseInt(t[0].tn) + parseInt(number) } : table)));
  };

  const setTableHeight = (id, number) => {
    let t = tables.filter((table) => table.id === id);
    if (parseInt(t[0].height) + parseInt(number) < 1 || parseInt(t[0].height) + parseInt(number) > 300) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, height: parseInt(t[0].height) + parseInt(number) } : table)));
  };

  const setTableWidth = (id, number) => {
    let t = tables.filter((table) => table.id === id);
    if (parseInt(t[0].width) + parseInt(number) < 1 || parseInt(t[0].width) + parseInt(number) > 300) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, width: parseInt(t[0].width) + parseInt(number) } : table)));
  };

  const handleLocationInputChange = (event) => {
    setLocationSearchValue(event.target.value);
  };
  const handleTableInputChange = (event) => {
    setTableSearchValue(event.target.value);
  };

  const handleLocation = (id) => {
    localStorage.setItem("venueID", id);
    setVenueNtable((prevValues) => ({ ...prevValues, venue: id }));
  };

  const handleTable = (id) => {
    setVenueNtable((prevValues) => ({ ...prevValues, table: id }));
    nav("/Menu");
  };

  return (
    <div className=" bg-[--c60] flex flex-col gap-4 overflow-y-hidden h-[100%] relative">
      <div className={` flex w-[100%] flex-col transition-all z-10 mx-auto text-3xl whitespace-nowrap select-none relative`}>
        {venueNtable.table && <p className="text-center">Current Selected Table: {venueNtable.table}</p>}
        {!venueNtable.table && <p className="text-center">Select Table: </p>}
        <button className="absolute right-0 top-0 bg-[--c1] p-2 text-center border-b-2 border-b-black rounded-xl mx-1">Save Layout</button>
      </div>

      <div className=" relative h-[100%] bg-[#ffffff6b] overflow-hidden">
        <div className={`grid grid-cols-${uniqueAreas.length} h-12 text-xl`}>
          {uniqueAreas.map((area, index) => (
            <button key={crypto.randomUUID()} onClick={() => setshowArea(area)} onTouchStart={() => setshowArea(area)} className={`${showArea === area ? "bg-[--c1]" : "bg-[--c12]"} border-b-2 border-b-black rounded-xl mx-1 my-1`}>
              {area}
            </button>
          ))}
        </div>
        <div className={`grid grid-cols-4 h-12 text-xl relative`}>
          <input list="areaslist" type="text" placeholder="Area name.." className="p-2 col-span-2" />
          <datalist id="areaslist">
            {uniqueAreas.map((area, index) => (
              <option value={area} key={crypto.randomUUID()}>
                {area}
              </option>
            ))}
          </datalist>
          <p className="p-2 bg-[--c1] inline-flex justify-between items-center border-b-2 border-b-black rounded-xl mx-1 my-1">
            Add new table <AiOutlineArrowRight />
          </p>
          <p className="p-2 bg-[--c12] inline-flex justify-between items-center border-b-2 border-b-black rounded-xl mx-1 my-1">
            Add new wall <AiOutlineArrowRight />
          </p>
        </div>

        {tables
          .filter((table, index) => table.area === showArea)
          .map((table, index) => {
            if (table.type === "wall") {
              return (
                <Draggable bounds={"#root"} position={draggingIndex === index ? { x: position.x, y: position.y, id: table.id } : { x: table.x, y: table.y, id: table.id }} onDrag={(event, data) => handleDrag(event, data, table.id)} handle=".draggAnchor" key={table.id}>
                  <div style={{ height: `${table.height + 20}px`, width: `${table.width + 20}px` }} className="fixed bg-gray-200 rounded-lg flex justify-center items-center m-auto">
                    <div className={`text-white shadow-[0px_2px_6px_2px_gray] bg-blue-500 text-xl draggAnchor z-[15] relative w-[100%] h-[100%] rounded-lg flex flex-col justify-center items-center m-auto`}>
                       
                      <div className="absolute gap-2 grid grid-cols-2 top-[-100px] left-1/2 bg-gray-300/75 text-black -translate-x-1/2 w-[250px] z-50 m-auto">
                        <p className="flex col-span-2 text-xs">*This hidden when not in edit mode</p>
                        {/* RiDeleteBin2Fill */}
                        
                        <div className="flex items-center justify-center">
                          <button className="p-2" onClick={() => setTableWidth(table.id, "-10")} onTouchStart={() => setTableWidth(table.id, "-10")}>
                            ➖
                          </button>
                          <IoIosResize className="rotate-[45deg]" />

                          <button className="p-2" onClick={() => setTableWidth(table.id, "+10")} onTouchStart={() => setTableWidth(table.id, "+10")}>
                            ➕
                          </button>
                        </div>

                        <div className="flex items-center justify-center">
                          <button className="p-2" onClick={() => setTableHeight(table.id, "-10")} onTouchStart={() => setTableHeight(table.id, "-10")}>
                            ➖
                          </button>
                          <IoIosResize className="rotate-[-45deg]" />

                          <button className="p-2" onClick={() => setTableHeight(table.id, "+10")} onTouchStart={() => setTableHeight(table.id, "+10")}>
                            ➕
                          </button>
                        </div>

                      </div>
                        <RiDeleteBin2Fill onClick={()=>console.log("to handle delete")} onTouchStart={()=>console.log("to handle delete")}  className="fill-[#ce1111] rounded border-2 border-red-500 absolute bottom-0 -left-10 text-3xl"/>
                    </div>
                  </div>
                </Draggable>
              );
            } else {
              let seats = Array.from({ length: table.seats }, (_, index) => index + 1);
              return (
                <Draggable bounds={"#root"} position={draggingIndex === index ? { x: position.x, y: position.y, id: table.id } : { x: table.x, y: table.y, id: table.id }} onDrag={(event, data) => handleDrag(event, data, table.id)} handle=".draggAnchor" key={table.id}>
                  <div style={{ height: `${table.height + 20}px`, width: `${table.width + 20}px` }} onClick={() => setTable(table.tn)} onTouchStart={() => setTable(table.tn)} className="fixed bg-gray-200 rounded-full flex justify-center items-center m-auto">
                    <div className={`text-white shadow-[0px_2px_6px_2px_gray] bg-blue-500 text-xl draggAnchor z-[15] relative w-[100%] h-[100%] rounded-full flex flex-col justify-center items-center m-auto`}>
                      {/* saved for later development */}
                      {/* {seats.map((seat, index) => (
                          <span key={crypto.randomUUID()} style={{ "--seats": `${(360.0 / parseFloat(table.seats)) * index}deg`, "--seat-width": `${table.width / 3.4}px`, "--seat-height": `${table.height * 1.2}px` }} className="seat absolute z-10"></span>
                        ))} */}

                      <div className="absolute gap-2 grid grid-cols-2 top-[-130px] left-1/2 bg-gray-300/75 text-black -translate-x-1/2 w-[250px] z-50 m-auto">
                        <p className="flex col-span-2 text-xs">*This hidden when not in edit mode</p>
                        <div className="flex items-center justify-center">
                          <button className="p-2" onClick={() => setTableNumber(table.id, "-1")} onTouchStart={() => setTableNumber(table.id, "-1")}>
                            ➖
                          </button>
                          <button className="" onClick={() => console.log("clicked mex")} onTouchStart={() => console.log("clicked me")}>
                            <CiHashtag className="text-black text-2xl" />
                          </button>
                          <button className="p-2" onClick={() => setTableNumber(table.id, "+1")} onTouchStart={() => setTableNumber(table.id, "+1")}>
                            ➕
                          </button>
                        </div>

                        <div className="flex items-center justify-center">
                          <button className="p-2" onClick={() => setTableSeats(table.id, "-1")} onTouchStart={() => setTableSeats(table.id, "-1")}>
                            ➖
                          </button>
                          <button className="" onClick={() => console.log("clicked mex")} onTouchStart={() => console.log("clicked me")}>
                            <LuPersonStanding className="text-black text-2xl" />
                          </button>
                          <button className="p-2" onClick={() => setTableSeats(table.id, "+1")} onTouchStart={() => setTableSeats(table.id, "+1")}>
                            ➕
                          </button>
                        </div>

                        <div className="flex items-center justify-center">
                          <button className="p-2" onClick={() => setTableWidth(table.id, "-10")} onTouchStart={() => setTableWidth(table.id, "-10")}>
                            ➖
                          </button>
                          <IoIosResize className="rotate-[45deg]" />

                          <button className="p-2" onClick={() => setTableWidth(table.id, "+10")} onTouchStart={() => setTableWidth(table.id, "+10")}>
                            ➕
                          </button>
                        </div>

                        <div className="flex items-center justify-center">
                          <button className="p-2" onClick={() => setTableHeight(table.id, "-10")} onTouchStart={() => setTableHeight(table.id, "-10")}>
                            ➖
                          </button>
                          <IoIosResize className="rotate-[-45deg]" />

                          <button className="p-2" onClick={() => setTableHeight(table.id, "+10")} onTouchStart={() => setTableHeight(table.id, "+10")}>
                            ➕
                          </button>
                        </div>
                      </div>
                      <RiDeleteBin2Fill onClick={()=>console.log("to handle delete")} onTouchStart={()=>console.log("to handle delete")}  className="fill-[#ce1111] rounded border-2 border-red-500 absolute bottom-0 -left-10 text-3xl"/>

                      <p className="z-20 inline-flex items-center text-black text-3xl">
                        <CiHashtag />
                        {table.tn}
                      </p>
                      <p className="z-20 inline-flex items-center text-black text-3xl">
                        <LuPersonStanding />
                        {table.seats}
                      </p>
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
