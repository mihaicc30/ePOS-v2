import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import VenueNTable from "../menu/VenueNTable";
import { getVenueById } from "../../utils/BasketUtils";
import { AiFillCaretRight, AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowUp, AiOutlineArrowRight } from "react-icons/ai";
import { BsArrowsMove } from "react-icons/bs";
import { IoIosResize } from "react-icons/io";
import { MdTableBar } from "react-icons/md";
import { GiRoundTable } from "react-icons/gi";
import { LuPersonStanding } from "react-icons/lu";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiCopy } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "../tables/Tables.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTableLayout, saveTableLayout } from "../../utils/DataTools";

const AdminTablePlan = ({ tables, setTables, draggingIndex, setDraggingIndex, showArea, setshowArea, uniqueAreas, setuniqueAreas, venues, venueNtable, setVenueNtable }) => {
  const [seeControlls, setseeControlls] = useState(false);
  const [seeControlls2, setseeControlls2] = useState(false);
  const [seeControlls3, setseeControlls3] = useState(false);
  const areaRef = useRef(null);

  useEffect(() => {}, [tables]);

  const resetLayout = async () => {
    setTables(await getTableLayout());
    toast.info(`Layout has been reset!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };

  const saveLayout = async() => {
    await saveTableLayout(tables,localStorage.getItem('venueID'))
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
  };

  const handleDrag = (event, data, id) => {
    if (!seeControlls3) return;
    setTables((prevTables) => prevTables.map((table) => (table.id === id ? { ...table, x: parseFloat(data.x.toFixed(2)), y: parseFloat(data.y.toFixed(2)) } : table)));
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
    <div className="flex flex-col overflow-auto">
      <div className="flex justify-between mt-1 gap-4">
        <p className="text-xl font-bold p-2 underline">Table Plan</p>
        <div className="flex justify-end mt-1 gap-4">
          <button onClick={resetLayout} className="bg-yellow-300/90 active:shadow-[inset_2px_2px_2px_black] p-2 text-center border-b-2 border-b-black rounded-xl mx-1">
            Reset Layout
          </button>
          <button onClick={saveLayout} className="bg-orange-400/90 active:shadow-[inset_2px_2px_2px_black] p-2 text-center border-b-2 border-b-black rounded-xl mx-1">
            Save Layout
          </button>
        </div>
      </div>
      <div className=" bg-[--c60] flex flex-col overflow-auto h-[100%] relative">
        <div className="absolute">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>

        <div className=" relative h-[100%] bg-[#ffffff6b] overflow-auto">
          <div className={`grid grid-cols-${uniqueAreas.length} h-12 text-xl`}>
            {uniqueAreas.map((area, index) => (
              <button key={crypto.randomUUID()} onClick={() => setshowArea(area)} onTouchStart={() => setshowArea(area)} className={`${showArea === area ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : "bg-[--c1]"} transition border-b-2 border-b-black rounded-xl mx-1 my-1`}>
                {area}
              </button>
            ))}
          </div>
          {localStorage.getItem("isAdmin") === "true" && (
            <div className={`grid grid-cols-7 h-12 text-xl relative m-2 `}>
              <input ref={areaRef} list="areaslist" type="text" placeholder="Area name.." className="p-2 col-span-2 border-b-2 border-b-black rounded-xl mx-1 my-1" />
              <datalist id="areaslist">
                {uniqueAreas.map((area, index) => (
                  <option value={area} key={crypto.randomUUID()}>
                    {area}
                  </option>
                ))}
              </datalist>
              <div onClick={() => pushNewElement("table")} className="whitespace-nowrap border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
                Add new table <AiOutlineArrowRight />
              </div>
              <div onClick={() => pushNewElement("wall")} className="whitespace-nowrap border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
                Add new wall <AiOutlineArrowRight />
              </div>
              <div onClick={() => setseeControlls(!seeControlls)} className="whitespace-nowrap border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
                Top Controlls {!seeControlls ? "🔴" : "🟢"}
              </div>
              <div onClick={() => setseeControlls2(!seeControlls2)} className="whitespace-nowrap border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
                Bottom Controlls {!seeControlls2 ? "🔴" : "🟢"}
              </div>
              <div onClick={() => setseeControlls3(!seeControlls3)} className="whitespace-nowrap border-b-2 px-4 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-nowrap items-center text-center text-sm justify-between font-semibold bg-[--c1]">
                Draggable {!seeControlls3 ? "🔴" : "🟢"}
              </div>
            </div>
          )}
          <div className="relative">
            {tables
              .filter((table, index) => table.area === showArea)
              .map((table, index) => {
                if (table.type === "wall") {
                  return (
                    <Draggable bounds={"#root"} position={draggingIndex === index ? { x: position.x, y: position.y, id: table.id } : { x: table.x, y: table.y, id: table.id }} onDrag={(event, data) => handleDrag(event, data, table.id)} handle=".draggAnchor" key={table.id}>
                      <div style={{ height: `${table.height + 20}px`, width: `${table.width + 20}px` }} className="fixed bg-gray-200 rounded-lg flex justify-center items-center m-auto">
                        <div className={`text-white shadow-[0px_2px_6px_2px_gray] bg-blue-950 text-xl draggAnchor z-[15] relative w-[100%] h-[100%] rounded-lg flex flex-col justify-center items-center m-auto`}>
                        <div className={`absolute gap-2 text-black ${seeControlls ? "grid" : "hidden"} grid grid-cols-1 bg-gray-300/75 text-black] z-50 left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[150px]`}>

                            <div className="flex items-center justify-center ">
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
                          <div className="flex absolute -bottom-4 gap-8">
                            <RiDeleteBin2Fill onClick={() => setTableDelete(table.id)} onTouchStart={() => setTableDelete(table.id)} className={`fill-[#ce1111] ${seeControlls2 ? "block" : "hidden"} rounded border-2 border-red-500 text-3xl`} />
                            <BiCopy onClick={() => setTableCopy(table.id)} onTouchStart={() => setTableCopy(table.id)} className={`fill-[#11ce3a] ${seeControlls2 ? "block" : "hidden"} rounded border-2 border-green-500 text-3xl`} />
                          </div>
                        </div>
                      </div>
                    </Draggable>
                  );
                } else {
                  let seats = Array.from({ length: table.seats }, (_, index) => index + 1);
                  return (
                    <Draggable bounds={"#root"} position={draggingIndex === index ? { x: position.x, y: position.y, id: table.id } : { x: table.x, y: table.y, id: table.id }} onDrag={(event, data) => handleDrag(event, data, table.id)} handle=".draggAnchor" key={table.id}>
                      <div style={{ height: `${table.height + 20}px`, width: `${table.width + 20}px` }} className="fixed bg-transparent rounded-full flex justify-center items-center m-auto">
                        <div className={`text-white bg-blue-400 text-xl draggAnchor relative w-[100%] h-[100%] rounded-[40px] flex flex-col flex-wrap justify-center items-center m-auto`}>
                          {/* saved for later development */}
                          {/* {seats.map((seat, index) => (
                          <span key={crypto.randomUUID()} style={{ "--seats": `${(360.0 / parseFloat(table.seats)) * index}deg`, "--seat-width": `${table.width / 1.7}px`, "--seat-height": `${(table.height + table.width + table.seats) / 2}px` }} className="seat absolute"></span>
                        ))} */}

                          <div className={`absolute gap-2 ${seeControlls ? "grid" : "hidden"} grid grid-cols-1 text-black bg-gray-300/75 text-black] z-50 left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] min-w-[150px]`}>
                            <div className="flex items-center justify-center">
                              <button className="p-2" onClick={() => setTableNumber(table.id, "-1")} onTouchStart={() => setTableNumber(table.id, "-1")}>
                                ➖
                              </button>
                              <button className="" onClick={() => console.log("clicked me🙀")} onTouchStart={() => console.log("clicked me🙀")}>
                              {table.tn}<MdTableBar className="text-black text-3xl" />
                              </button>
                              <button className="p-2" onClick={() => setTableNumber(table.id, "+1")} onTouchStart={() => setTableNumber(table.id, "+1")}>
                                ➕
                              </button>
                            </div>

                            {/* <div className="flex items-center justify-center">
                              <button className="p-2" onClick={() => setTableSeats(table.id, "-1")} onTouchStart={() => setTableSeats(table.id, "-1")}>
                                ➖
                              </button>
                              <button className="" onClick={() => console.log("clicked me🙀")} onTouchStart={() => console.log("clicked me🙀")}>
                                <LuPersonStanding className="text-black text-3xl" />
                              </button>
                              <button className="p-2" onClick={() => setTableSeats(table.id, "+1")} onTouchStart={() => setTableSeats(table.id, "+1")}>
                                ➕
                              </button>
                            </div> */}

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

                          <p className="z-20 inline-flex items-center text-black text-2xl ">
                            <MdTableBar className="text-2xl" />
                            {table.tn}
                          </p>
                          {/* <p className="z-20 inline-flex items-center text-black text-2xl">
                            <LuPersonStanding className="text-3xl" />
                            {table.seats}
                          </p> */}
                          <div className="flex absolute -bottom-4 gap-8">
                            <RiDeleteBin2Fill onClick={() => setTableDelete(table.id)} onTouchStart={() => setTableDelete(table.id)} className={`fill-[#ce1111] ${seeControlls2 ? "block" : "hidden"} rounded border-2 border-red-500 text-3xl`} />
                            <BiCopy onClick={() => setTableCopy(table.id)} onTouchStart={() => setTableCopy(table.id)} className={`fill-[#11ce3a] ${seeControlls2 ? "block" : "hidden"} rounded border-2 border-green-500 text-3xl`} />
                          </div>
                        </div>
                      </div>
                    </Draggable>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTablePlan;
