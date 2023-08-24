import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import VenueNTable from "../menu/VenueNTable";
import { getVenueById } from "../../utils/BasketUtils";
import { AiFillCaretRight, AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowUp, AiOutlineArrowRight } from "react-icons/ai";
import { BsArrowsMove } from "react-icons/bs";
import { IoIosResize } from "react-icons/io";
import { MdTableBar, MdOutlineAirlineSeatLegroomExtra } from "react-icons/md";
import { GiRoundTable } from "react-icons/gi";
import { TbArrowsMaximize } from "react-icons/tb";
import { PiSelectionBackground, PiArmchairLight } from "react-icons/pi";
import { RxMix } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiCopy } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "../tables/Tables.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTableLayout, saveTableLayout } from "../../utils/DataTools";
import "./AdminTablePlan.css";

const AdminTablePlan = ({ tables, setTables, draggingIndex, setDraggingIndex, showArea, setshowArea, uniqueAreas, setuniqueAreas, venues, venueNtable, setVenueNtable }) => {
  const [tpCols, setTPCols] = useState(20);
  const [tpRows, setTPRows] = useState(20);
  const [activeBox, setActiveBox] = useState(null);
  const [savingLayout, setSavingLayout] = useState(false);

  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState(false);

  const [tb, setTB] = useState({});

  const handleLayoutChange = (which, value) => {
    let indexOfGrid = tb.gridSize.findIndex((item) => item[0] === showArea);
    switch (which) {
      case "Cols":
        setTPCols(value);
        tb.gridSize[indexOfGrid][1] = value;
        break;
      case "Rows":
        setTPRows(value);
        tb.gridSize[indexOfGrid][2] = value;
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    (async () => {
      let query = await getTableLayout();
      setTB(query);
      if (!uniqueAreas.includes(showArea)) return;
      setTimeout(() => {
        const listWithBar = query.gridSize.find(([list]) => list === showArea);
        console.log("🚀 ~ file: AdminTablePlan.jsx:62 ~ setTimeout ~ listWithBar:", listWithBar);
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

  const deleteCurrentArea = () => {
    let tempGridSize = Array(tb.gridSize)[0].filter((item) => item[0] !== showArea);
    let templayout = tb.layout.filter((item) => item.area !== showArea);
    setTB((prevTB) => ({
      ...prevTB,
      gridSize: tempGridSize,
      layout: templayout,
    }));
    setuniqueAreas((prevTB) => prevTB.filter((item) => item !== showArea));
  };

  const handleDuplicate = () => {
    if (activeBox) {
      const itemToDupe = tb.layout.find((item) => item.id === activeBox.id);
      if (itemToDupe) {
        const duplicatedItem = {
          ...itemToDupe,
          id: crypto.randomUUID(),
          x1: 1,
          x2: 2,
          y1: 1,
          y2: 2,
          tn: 1,
        };
        setTB((prevTB) => ({
          ...prevTB,
          layout: [...prevTB.layout, duplicatedItem],
        }));
      }
    }
  };

  const handleDelete = () => {
    if (activeBox) {
      const itemToDelete = tb.layout.filter((item) => item.id !== activeBox.id);
      setTB((prevTB) => ({
        ...prevTB,
        layout: itemToDelete,
      }));
    }
    setActiveBox(null);
  };

  const saveLayout = async () => {
    setSavingLayout(true);
    try {
      let data = {
        venueID: parseInt(localStorage.getItem("venueID")),
        tb,
      };
      await saveTableLayout(data);
      setTables(await getTableLayout());
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
      setSavingLayout(false);
    } catch (error) {
      alert(error.message);
      setSavingLayout(false);
    }
  };

  const handleChange = (value, target, who) => {
    setTB((prevTB) => {
      const updatedLayout = prevTB.layout.map((box) => {
        if (box.id === activeBox.id) {
          const updatedBox = {
            ...box,
            [who]: parseInt(value),
          };

          if (who === "x1" && parseInt(value) >= updatedBox.x2) {
            updatedBox.x2 = parseInt(value) + 1;
          } else if (who === "y1" && parseInt(value) >= updatedBox.y2) {
            updatedBox.y2 = parseInt(value) + 1;
          }
          setActiveBox(updatedBox);
          return updatedBox;
        }
        return box;
      });

      return {
        ...prevTB,
        layout: updatedLayout,
      };
    });
  };

  const handleInsert = async () => {
    let TL = tb.layout;
    if (modalData.elementType === "Table" || modalData.elementType === "Wall") {
      const newElement = {
        id: crypto.randomUUID(),
        area: modalData.floor || showArea,
        tn: 1,
        fromvenueid: 101010,
        x1: 1,
        y1: 1,
        x2: 2,
        y2: 2,
        type: String(modalData.elementType).toLowerCase(),
        seats: 2,
      };
      if (!uniqueAreas.includes(modalData.floor)) {
        setTB((prevTB) => ({
          ...prevTB,
          gridSize: [...prevTB.gridSize, [modalData.floor, 20, 20]],
          layout: [...prevTB.layout, newElement],
        }));
        setuniqueAreas((prevTB) => [...prevTB, modalData.floor]);
      } else {
        console.log("step2");
        setTB((prevTB) => ({
          ...prevTB,
          layout: [...prevTB.layout, newElement],
        }));
      }
      setModal(!modal);
    } else if (modalData.elementType === "Floor Plan" || !modalData.elementType) {
      console.log(uniqueAreas);
      console.log(modalData.floor);
      console.log(uniqueAreas.includes(modalData.floor));
      if (uniqueAreas.includes(modalData.floor)) {
        toast.error(`Floor name already exists.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      } else if (!modalData.floor) {
        toast.error(`Floor name required.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      } else {
        let tempGrid = tb.gridSize;
        tempGrid.push([modalData.floor, 20, 20]);
        setTB((prevTB) => ({
          ...prevTB,
          gridSize: tempGrid,
        }));
        setuniqueAreas((prev) => [...prev, modalData.floor]);
        // setTB

        setModal(!modal);
        toast.success(`${modalData.floor} has been added to the layout.`, {
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
    }
  };

  return (
    <div className="flex flex-col overflow-auto h-[100%] w-[100%]">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      {modal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
          <div className="fixed right-0 left-[25%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-2 text-lg animate-fadeUP1" onClick={() => setModal(!modal)}>
              ◀ Cancel
            </button>
            <div className="mt-[10svh] flex flex-col w-[70%] gap-8">
              <div className="relative flex flex-col">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Element Type</span>
                <select
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      elementType: e.target.value,
                    }))
                  }
                  defaultValue={modalData.elementType || "Floor Plan"}
                  className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl">
                  <option value="Floor Plan">Floor Plan</option>
                  <option value="Table">Table</option>
                  <option value="Wall">Wall</option>
                </select>
              </div>
              <div className="relative ">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">{modalData.elementType && modalData.elementType !== "Floor Plan" ? "Insert into Floor Named" : "New floor name"}</span>
                <input
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      floor: e.target.value,
                    }))
                  }
                  list="cats2"
                  type="text"
                  placeholder={"Floor name"}
                  defaultValue={""}
                  className="p-2 text-lg border-y-2 border-y-black/30 font-bold shadow-lg rounded-xl w-[100%]"
                />
                <datalist id="cats2">
                  {uniqueAreas.map((area, index) => (
                    <option value={area} key={index + "dqwdq"}>
                      {area}
                    </option>
                  ))}
                </datalist>
              </div>

              <button onClick={handleInsert} className="flex gap-2 mx-auto flex-nowrap items-center my-4 bg-orange-300 active:shadow-[inset_2px_2px_2px_black] p-2 text-center border-b-2 border-b-black rounded-xl ">
                Insert Element
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-1 gap-4">
        <p className="text-xl font-bold p-2 underline whitespace-nowrap">Table Plan</p>
        <div className="flex mt-1 gap-4 w-[100%]">
          <button
            onClick={() => {
              setActiveBox(null);
              setModal(!modal);
              setModalData({});
            }}
            className="flex gap-2 flex-nowrap items-center mr-auto bg-orange-300 active:shadow-[inset_2px_2px_2px_black] p-2 text-center border-b-2 border-b-black rounded-xl ">
            <RxMix className="text-xl" />
            <span> Insert Element</span>
          </button>

          <button onClick={deleteCurrentArea} className="flex gap-2 flex-nowrap items-center bg-orange-400 active:shadow-[inset_2px_2px_2px_black] p-2 text-center border-b-2 border-b-black rounded-xl ">
            Delete Current Area
          </button>

          <button disabled={savingLayout} onClick={saveLayout} className={`${savingLayout ? "text-gray-300" : "bg-orange-300"}  active:shadow-[inset_2px_2px_2px_black] p-2 text-center border-b-2 border-b-black rounded-xl mx-1`}>
            Save Layout
          </button>
        </div>
      </div>
      <div className=" bg-[--c60] flex flex-col overflow-auto h-[100%] relative ">
        <div className="absolute">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
        {activeBox && (
          <Draggable handle=".handle" defaultPosition={{ x: 110, y: 110 }} position={null} scale={1}>
            <div className={`z-50 absolute w-[190px] mphism m-1 p-2 bg-transparent ${activeBox ? "" : "hidden"}`}>
              <div className="flex flex-nowrap gap-4">
                <div className="grow handle border-2 border-dashed m-1 p-1 mphism border-[#fff] cursor-move">
                  <TbArrowsMaximize className="mx-auto cursor-move" />
                </div>
                <button onClick={() => setActiveBox(null)} className="mphism px-2 m-1 font-[600]">
                  X
                </button>
              </div>
              <div className="flex flex-col">
                <div className="grid grid-cols-1 my-2 justify-items-center mphism">
                  <span className="text-xs text-center">Layout Grid</span>
                  <div className="grid grid-cols-2 gap-4  justify-items-center">
                    <div className="flex flex-nowrap items-center ">
                      X:
                      <input type="number" className=" bg-transparent w-[50px] text-center border-2 border-dashed border-[#fff]" onChange={(e) => handleLayoutChange("Cols", e.target.value)} value={tpCols} />
                    </div>
                    <div className="flex flex-nowrap items-center">
                      Y:
                      <input type="number" className="bg-transparent w-[50px] text-center border-2 border-dashed border-[#fff]" onChange={(e) => handleLayoutChange("Rows", e.target.value)} value={tpRows} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 my-2 mphism">
                  <span className="text-xs text-center">Table Setup</span>

                  <div className="grid grid-cols-1 my-2">
                    <span className="text-xs text-center">Position</span>
                    <div className="grid grid-cols-2 gap-4 justify-items-center">
                      <div className="flex flex-nowrap items-center">
                        X:
                        <input type="number" className="bg-transparent w-[50px] text-center border-2 border-dashed border-[#fff]" onChange={(e) => handleChange(e.target.value, "Position", "x1")} min={1} max={tpCols} value={parseInt(activeBox.x1)} />
                      </div>
                      <div className="flex flex-nowrap items-center">
                        Y:
                        <input type="number" className="bg-transparent w-[50px] text-center border-2 border-dashed border-[#fff]" onChange={(e) => handleChange(e.target.value, "Position", "y1")} min={1} max={tpRows} value={parseInt(activeBox.y1)} />
                      </div>
                    </div>

                    <span className="text-xs text-center">Dimensions</span>
                    <div className="grid grid-cols-2 gap-4 justify-items-center">
                      <div className="flex flex-nowrap items-center">
                        W:
                        <input type="number" className="bg-transparent w-[50px] text-center border-2 border-dashed border-[#fff]" onChange={(e) => handleChange(e.target.value, "Dimensions", "x2")} min={parseInt(activeBox.x1) + 1} max={tpCols + 1} value={parseInt(activeBox.x2)} />
                      </div>
                      <div className="flex flex-nowrap items-center">
                        H:
                        <input type="number" className="bg-transparent w-[50px] text-center border-2 border-dashed border-[#fff]" onChange={(e) => handleChange(e.target.value, "Dimensions", "y2")} min={parseInt(activeBox.y1) + 1} max={tpRows + 1} value={parseInt(activeBox.y2)} />
                      </div>
                    </div>
                    {activeBox && activeBox.type !== "wall" && (
                      <>
                        <span className="text-xs text-center">Number & Seats</span>
                        <div className="grid grid-cols-2 gap-4 justify-items-center">
                          <div className="flex flex-nowrap items-center">
                            <MdTableBar />:
                            <input type="number" className="appearance-none bg-transparent w-[50px] text-center border-2 border-dashed border-[#fff]" onChange={(e) => handleChange(e.target.value, "Number", "tn")} min={1} value={activeBox.tn} />
                          </div>
                          <div className="flex flex-nowrap items-center cursor-not-allowed">
                            {/* keeping for future development when Booking system is created */}
                            <MdOutlineAirlineSeatLegroomExtra className=" cursor-not-allowed text-gray-300" />:
                            <input type="number" className="bg-gray-300 text-gray-300 w-[50px] text-center border-2 border-dashed border-[#fff] cursor-not-allowed " defaultValue={activeBox.seats} />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="grid grid-cols-2 gap-4 justify-items-center my-4">
                      <button className="p-2 mphism" onClick={handleDelete}>
                        <RiDeleteBin6Line className="text-3xl text-red-400" />
                      </button>
                      <button className="p-2 mphism" onClick={handleDuplicate}>
                        <BiCopy className="text-3xl text-yellow-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Draggable>
        )}

        <div className=" relative h-[100%] bg-[#ffffff6b] flex flex-col">
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
                if (table.area === showArea)
                  return (
                    <div onClick={() => setActiveBox(table)} key={index + "tL"} className={`relative flex flex-col justify-center mphism ${table.type === "wall" ? "bg-none bg-blue-200 " : ""} items-center ${activeBox && activeBox.id === table.id ? "border-[3px] border-orange-400" : ""}  `} style={{ gridColumnStart: `${table.x1}`, gridColumnEnd: `${table.x2}`, gridRowStart: `${table.y1}`, gridRowEnd: `${table.y2}` }}>
                      <div className="animate-colorFlash  flex flex-col justify-center items-center gap-2  rounded-xl h-[100%] w-[100%]">{table.type !== "wall" && <span className="whitespace-nowrap">T-{table.tn}</span>}</div>
                    </div>
                  );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTablePlan;
