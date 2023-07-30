import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import VenueNTable from "../menu/VenueNTable";
import { getVenueById, getTableTime, handleTransferSetTable } from "../../utils/BasketUtils";
import { deleteEmptyTable } from "../../utils/DataTools";

import { AiFillCaretRight, AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowUp, AiOutlineArrowRight } from "react-icons/ai";
import { BsArrowsMove } from "react-icons/bs";
import { IoIosResize } from "react-icons/io";
import { GiRoundTable } from "react-icons/gi";
import { LuPersonStanding } from "react-icons/lu";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiCopy } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalChangeTable = ({ setModalChangeTable, setBasketDiscount, basketItems, setBasketItems, tables, setTables, draggingIndex, setDraggingIndex, showArea, setshowArea, uniqueAreas, setuniqueAreas, venues, venueNtable, setVenueNtable }) => {
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

  //   const setTable = async (tableNumber) => {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_API}getTable`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Credentials": true,
  //         },
  //         body: JSON.stringify({
  //           tableNumber,
  //           venue: localStorage.getItem("venueID"),
  //           user: { displayName: localStorage.getItem("displayName"), email: localStorage.getItem("email") },
  //         }),
  //       });
  //       const data = await response.json();
  //       if (response.status == 200) {
  //         setBasketItems(data.basket);
  //         setBasketDiscount(data.tableDiscount);
  //         setVenueNtable((prevValues) => ({ ...prevValues, table: tableNumber }));
  //         localStorage.setItem("tableID", tableNumber);
  //         nav("/Menu");
  //         console.log(`Received table data. Table locked. `);
  //       } else {
  //         toast.error(`${data.message}`, {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: false,
  //           progress: undefined,
  //           theme: "light",
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching:", error);
  //       toast.error(error.message, {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: false,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     }
  //   };

  const handleTransfer = async (tn) => {
    const query = await handleTransferSetTable(tn);
    if (query.status === "ok") {
      toast.success(query.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      setVenueNtable((prevValues) => ({ ...prevValues, table: tn }));
      localStorage.setItem("tableID", tn);
      setModalChangeTable(false);
    } else {
      toast.error(query.message, {
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
    <div className="bg-[--c60] flex flex-col gap-4 overflow-y-hidden h-[100%] relative w-[100%]">
      <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setModalChangeTable(false)}>
        ◀ Cancel
      </button>
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
      <div className={` flex w-[100%] flex-col transition-all z-10 mx-auto text-xl whitespace-nowrap select-none relative mt-10`}>
        <p className="text-center">{venueNtable.table ? `Current Selected Table: ${venueNtable.table}` : `Select a Table.`}</p>
      </div>
      <div className=" relative h-[100%] bg-[#ffffff6b] overflow-hidden">
        <div className={`grid grid-cols-${uniqueAreas.length} h-12 text-xl`}>
          {uniqueAreas.map((area, index) => (
            <button key={crypto.randomUUID()} onClick={() => setshowArea(area)} onTouchStart={() => setshowArea(area)} className={`${showArea === area ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : "bg-[--c1]"} transition border-b-2 border-b-black rounded-xl mx-1 my-1`}>
              {area}
            </button>
          ))}
        </div>
        {tables
          .filter((table, index) => table.area === showArea)
          .map((table, index) => {
            if (table.type === "wall") {
              return (
                <Draggable bounds={"#root"} position={draggingIndex === index ? { x: position.x, y: position.y, id: table.id } : { x: table.x, y: table.y, id: table.id }} handle=".draggAnchor" key={table.id}>
                  <div style={{ height: `${table.height + 20}px`, width: `${table.width + 20}px` }} className="fixed bg-gray-200 rounded-lg flex justify-center items-center m-auto">
                    <div className={`text-white shadow-[0px_2px_6px_2px_gray] bg-blue-950 text-xl draggAnchor z-[15] relative w-[100%] h-[100%] rounded-lg flex flex-col justify-center items-center m-auto`}></div>
                  </div>
                </Draggable>
              );
            } else {
              return (
                <Draggable bounds={"#root"} position={draggingIndex === index ? { x: position.x, y: position.y, id: table.id } : { x: table.x, y: table.y, id: table.id }} handle=".draggAnchor" key={table.id}>
                  <div style={{ height: `${table.height + 20}px`, width: `${table.width + 20}px` }} onClick={() => handleTransfer(table.tn)} onTouchStart={() => handleTransfer(table.tn)} className="fixed bg-transparent rounded-full flex justify-center items-center m-auto">
                    <div className={`text-white bg-blue-400 text-xl draggAnchor relative w-[100%] h-[100%] rounded-[40px] flex flex-col flex-wrap justify-center items-center m-auto`}>
                      <p className="z-20 flex items-center text-black text-2xl my-2">T-{table.tn}</p>
                      {tableClock["t" + table.tn] && <p className="z-20 inline-flex items-center text-black text-2xl">{Math.floor((new Date() - new Date().setHours(...tableClock["t" + table.tn].split(":"))) / (1000 * 60))}min</p>}
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

export default ModalChangeTable;
