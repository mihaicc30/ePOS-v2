import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Menu.css";
import { getUser, getVenue } from "../../utils/authUser";
import { calculateTotal, calculateBasketQTY } from "../../utils/BasketUtils";
import { deleteEmptyTable, addOrder } from "../../utils/DataTools";
import VenueNTable from "./VenueNTable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BillTimeline from "../modals/BillTimeline";

import { AiFillCaretRight, AiOutlineLeft } from "react-icons/ai";
import { BsFilterRight } from "react-icons/bs";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";

import MenuLeftSide from "./MenuLeftSide";
import MenuRightSide from "./MenuRightSide";

import ModalChangeTable from "./ModalChangeTable";

const Menu = ({ draggingIndex, setDraggingIndex, uniqueAreas, setuniqueAreas, showArea, setshowArea, tables, setTables, lefty, basketDiscount, setBasketDiscount, basketItems, menuitems, setBasketItems, searchValue, setSearchValue, venues, venueNtable, setVenueNtable }) => {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisabled2, setIsButtonDisabled2] = useState(false);
  const [isButtonDisabled3, setIsButtonDisabled3] = useState(false);
  const [billTimeline, setBillTimeline] = useState(false);

  const modalMessageRef = useRef(null);
  const [messageModal, openMessageModal] = useState(false);
  const [messageModalData, setMessageModalData] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    if (venueNtable.table === "" || !venueNtable.table) return nav("/Tables");
  }, [venueNtable]);

  const handleMenuOpenTable = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}leaveTable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          tableNumber: localStorage.getItem("tableID"),
          user: { displayName: localStorage.getItem("displayName"), email: localStorage.getItem("email") },
          venue: localStorage.getItem("venueID"),
        }),
      });
      const data = await response.json();

      setVenueNtable((prevValues) => ({ ...prevValues, table: null }));
      deleteEmptyTable();
      console.log(data.message);
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

  const handleBillPrint = async () => {
    if (isButtonDisabled3) return;
    // console.log(venueNtable);
    // "bill"
    // const query = await addOrder(data)
    // console.log("🚀", query)

    setIsButtonDisabled3(true);
    // handlePrinting();
    setTimeout((async) => {
      setIsButtonDisabled3(false);
    }, 1000);
  };

  const handleBarPrint = async() => {
    if (isButtonDisabled2) return;
    setIsButtonDisabled2(true);
    console.log("🚀", query);
    // await handlePrinting("bar");
    setTimeout(() => {
      setIsButtonDisabled2(false);
    }, 1000);
  };

  const handleKitchenPrint = async () => {
    if (isButtonDisabled) return;
    await handlePrinting("kitchen");
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

  useEffect(() => {
    getUser(setUser);
    getVenue(setVenueNtable);
  }, []);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const [viewSearch, setViewSearch] = useState(false);

  const location = useLocation();
  const isBaseRoute = location.pathname === "/menu";

  const handleF1 = (event) => {
    setSelectedKCal(event.target.name);
  };
  const handleF2 = (event) => {
    setSelectedDietary(event.target.name);
  };

  const handleItemClick = (c, i) => {
    // Navigate to the item details route
    nav(`/${c}/${i}`);
  };

  const [basketTotal, setBasketTotal] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setBasketTotal(calculateTotal(basketItems, basketDiscount));
  }, [basketItems, basketDiscount]);

  useEffect(() => {
    setTotalProducts(calculateBasketQTY(basketItems));
  }, [basketItems]);

  const [modal, setModal] = useState(false);

  const handleDiscount = () => {
    console.log("basketDiscount", basketDiscount, basketDiscount < 1);
    if (basketDiscount < 1) {
      setModal(!modal);
    } else {
      setBasketDiscount(0);
      toast.success(`Discount removed.`, {
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

  const setDiscount = (amount) => {
    setBasketDiscount(amount);
    setModal(!modal);
    toast.success(`Discount ${amount}% added.`, {
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

  const handlePrinting = async (forWhere) => {
    if (basketItems.length < 1) {
      toast.warn(`There are no items to print.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    let areAllPrinted = basketItems.some((item) => item.printed == false);
    const updatedBasketItems = basketItems.map((item) => {
      if (!item.printed) {
        return {
          ...item,
          printed: true,
          datePrinted: new Date().toISOString("en-GB"),
          printedBy: localStorage.getItem("displayName"),
        };
      }
      return item;
    });
    setBasketItems(updatedBasketItems);

    if (areAllPrinted) {
      let data = {
        orderType: forWhere,
        venueID: venueNtable.venue,
        table: venueNtable.table,
        displayName: localStorage.getItem("displayName"),
        email: localStorage.getItem("email"),
        items: basketItems,
      };
      const query = await addOrder(data);

      toast.success(`Ticket has been printed.`, {
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
      toast.info(`Ticket has been re-printed.`, {
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

  useEffect(() => {
    const waitingTime = setTimeout(async () => {
      // do query
      try {
        const response = await fetch(`${import.meta.env.VITE_API}updateTableBasket`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            tableNumber: localStorage.getItem("tableID"),
            user: { displayName: localStorage.getItem("displayName"), email: localStorage.getItem("email") },
            venue: localStorage.getItem("venueID"),
            basket: basketItems,
            tableDiscount: basketDiscount,
          }),
        });

        const data = await response.json();
        if (response.status == 200) {
          console.log(`Updating basket for table ${localStorage.getItem("tableID")}.`);
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
    }, 1000);

    return () => clearTimeout(waitingTime);
  }, [basketItems, basketDiscount]);

  const [modalChangeTable, setModalChangeTable] = useState(false);

  const handleChangeTable = () => {
    console.log("handleChangeTable");
    setModalChangeTable(!modalChangeTable);
  };

  const handleAddLine = () => {
    let line = {
      name: "Line",
      refID: crypto.randomUUID(),
      dateString: new Date().toLocaleString(),
      date: new Date().toISOString("en-GB"),
      price: 0,
      qty: 1,
    };
    setBasketItems([...basketItems, { ...line }]);
  };

  const handleAddMessage = (msg) => {
    const message = modalMessageRef.current.value;
    if (selectedItem.message !== "") {
      const updatedBasket = basketItems.map((item) => {
        if (item.refID === selectedItem.refID) {
          return { ...item, message: message, messageBy: localStorage.getItem("email") };
        }
        return item;
      });
      setSelectedItem({});
      setBasketItems(updatedBasket);
    }
    openMessageModal(false);
  };

  const handleMessage = () => {
    if (Object.keys(selectedItem).length < 1) {
      toast.error(`Need to select an item first.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (selectedItem.printed) {
      toast.error(`Denied. Item has already been printed.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const itemFromBasket = basketItems.find((item) => item.refID === selectedItem.refID);

    if (itemFromBasket.message) {
      const updatedBasket = basketItems.map((item) => {
        if (item.refID === itemFromBasket.refID) {
          return { ...item, message: false };
        }
        return item;
      });
      setSelectedItem({});
      setBasketItems(updatedBasket);
      openMessageModal(false);
    } else {
      if (!messageModal) openMessageModal(!messageModal);
      setMessageModalData(itemFromBasket.refID, itemFromBasket.name);
      setTimeout(() => {
        modalMessageRef.current.focus();
      }, 111);
    }
  };

  const handleEnterKey = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleAddMessage();
    }
  };

  const addMessageStatus = () => {
    if (Object.keys(selectedItem).length < 1) return true;
    return false;
  };

  const messageStatusAction = () => {
    if (Object.keys(selectedItem).length > 1 && selectedItem.message) return true;
    return false;
  };
  return (
    <>
      {messageModal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? openMessageModal(!messageModal) : null)}>
          <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => openMessageModal(!messageModal)}>
              ◀ Cancel
            </button>

            <p className="text-center text-xl mt-10 border-b-2 border-b-[--c1]">Add Message Form</p>
            <p className="text-center mt-4">Add Message to {messageModalData.name}</p>

            <input ref={modalMessageRef} onKeyDown={handleEnterKey} type="text" defaultValue={``} className="border-b-2 border-b-black border-t-2 border-t-gray-200 rounded-xl p-4 mx-auto mb-6 text-center w-[80%]" placeholder="Type your message here.." />
            <button onClick={handleAddMessage} className="tableNumber mx-auto w-1/2 p-6 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] border-b-2 border-b-black ">
              Add ▶
            </button>
          </div>
        </div>
      )}
      {modalChangeTable && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModalChangeTable(!modalChangeTable) : null)}>
          <div className="fixed right-0 left-[5%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <ModalChangeTable setModalChangeTable={setModalChangeTable} setBasketDiscount={setBasketDiscount} basketItems={basketItems} setBasketItems={setBasketItems} tables={tables} setTables={setTables} showArea={showArea} setshowArea={setshowArea} uniqueAreas={uniqueAreas} setuniqueAreas={setuniqueAreas} venues={venues} venueNtable={venueNtable} setVenueNtable={setVenueNtable} />
          </div>
        </div>
      )}
      <div className="absolute">
        {billTimeline && <BillTimeline setBillTimeline={setBillTimeline} basketItems={basketItems} venueNtable={venueNtable} venues={venues} />}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      <div className={`modalBG ${modal ? "fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" : "hidden"}`} onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
        <div className={`fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center`}>
          <button className="block mr-auto p-2 mb-8 text-3xl animate-fadeUP1" onClick={() => setModal(!modal)}>
            ◀ Cancel
          </button>
          <p className="text-center text-3xl mt-20 mb-4">Apply Discount</p>
          <span className="border-b-2 w-[300px] mb-4"></span>
          <div className="flex flex-col mb-20 text-center gap-4">
            <button onClick={() => setDiscount(5)} className="flex-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center bg-[--c1] border-b-2 border-b-black w-[200px] mx-auto font-bold">
              <span className="mx-auto text-xl">5%</span>
            </button>
            <button onClick={() => setDiscount(10)} className="flex-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center bg-[--c1] border-b-2 border-b-black w-[200px] mx-auto font-bold">
              <span className="mx-auto text-xl">10%</span>
            </button>
            <button onClick={() => setDiscount(25)} className="flex-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center bg-[--c1] border-b-2 border-b-black w-[200px] mx-auto font-bold">
              <span className="mx-auto text-xl"> 25%</span>
            </button>
            <button onClick={() => setDiscount(50)} className="flex-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center bg-[--c1] border-b-2 border-b-black w-[200px] mx-auto font-bold">
              <span className="mx-auto text-xl"> 50%</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[100%]">
        <div className={`flex ${lefty ? "flex-row-reverse" : ""} grow gap-1 rounded overflow-y-scroll`}>
          <div className="basis-[40%] h-[100%] w-[100%] rounded shadow-xl flex flex-col p-1 overflow-hidden">
            <div className="grid grid-cols-5 gap-2 h-[62px] font-bold">
              <button onClick={handleChangeTable} className="text-xs bg-gray-300 m-1 p-1 rounded-xl transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90]  flex flex-col justify-center items-center border-b-2 border-b-black ">
                <span>Transfer</span>
                <span>Table</span>
              </button>
              <div className="tableNumber m-1 p-1 rounded-xl flex flex-col text-center text-xs justify-center font-semibold border-b-2 bg-gray-300 border-b-black ">
                <p>Table</p>
                <p className="text-3xl">{venueNtable.table}</p>
              </div>
              <button onClick={handleMenuOpenTable} className="text-xs bg-gray-300 m-1 p-1 rounded-xl transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90]  flex flex-col justify-center items-center border-b-2 border-b-black ">
                <span>Open</span>
                <span>Table</span>
              </button>
              <button disabled={addMessageStatus()} onClick={handleMessage} className="text-xs bg-gray-300 disabled:bg-gray-300/50 disabled:text-gray-300 m-1 p-1 rounded-xl transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90]  flex flex-col justify-center items-center border-b-2 border-b-black ">
                <span>{messageStatusAction() ? "Remove" : "Add"}</span>
                <span>Message</span>
              </button>
              <button onClick={handleAddLine} className="relative text-xs bg-gray-300 m-1 p-1 rounded-xl transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90]  flex flex-col justify-center items-center border-b-2 border-b-black ">
                <span>Line</span>
                <span className="absolute bottom-[8px] text-xl">↕</span>
                <span className="border-b-2 w-[100%] h-4 border-b-black"></span>
              </button>
            </div>

            <div className="MenuLeftSide flex flex-col overflow-hidden grow">
              <div className="MenuLeftSide flex flex-col overflow-y-scroll py-2">
                <MenuLeftSide lefty={lefty} menuitems={menuitems} basketItems={basketItems} setBasketItems={setBasketItems} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
              </div>
              <div className={`text-xl text-end mt-auto flex justify-between ${lefty ? "flex-row-reverse" : ""}`}>
                <div>
                  <span>Items: </span>
                  <span className="font-[600]">{totalProducts}</span>
                </div>
                <div>
                  <span>Total: </span>
                  <span className="font-[600]">£{basketTotal}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="basis-[60%] MenuRightSide h-[100%] w-[100%] rounded shadow-xl p-1 flex flex-col overflow-hidden">
            <MenuRightSide lefty={lefty} menuitems={menuitems} basketItems={basketItems} setBasketItems={setBasketItems} />
          </div>
        </div>

        <div className={`flex ${lefty ? "flex-row-reverse" : ""} justify-end min-h-[60px] col-span-2`}>
          {basketDiscount > 0 && <span className={`basis-[10%] border-b-2 border-b-black mr-auto transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-green-400`}>{basketDiscount}% Discount</span>}
          <button disabled={basketItems.length < 1} onClick={() => setBillTimeline(!billTimeline)} className={`basis-[10%] items-center border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${parseFloat(basketTotal) <= 0 ? "bg-gray-300 text-gray-400" : "bg-[--c1]"} `}>
            View Bill Timeline
          </button>
          <button disabled={parseFloat(basketTotal) <= 0} onClick={() => nav("/Payment")} className={`basis-[10%] items-center border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${parseFloat(basketTotal) <= 0 ? "bg-gray-300 text-gray-400" : "bg-[--c1]"} `}>
            Pay Bill
          </button>
          <div className={`basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]`} onClick={() => console.log("dev**popup w/ custom item&price")}>
            Misc Item
          </div>
          <div className={`${basketDiscount > 0 ? "bg-[--c12] shadow-[inset_0px_4px_2px_0px_black]" : "bg-[--c1] "} basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={handleDiscount}>
            {basketDiscount > 0 ? "Remove Discount" : "Apply Discount"}
          </div>
          <div
            onClick={() => {
              handleBillPrint();
            }}
            disabled={isButtonDisabled3}
            className={`basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] ${isButtonDisabled3 ? "bg-gray-200 " : "bg-[--c1]"}`}>
            {isButtonDisabled3 && <AiOutlineLoading3Quarters className="animate-spin mx-auto text-5xl" />}
            {!isButtonDisabled3 && "Print Bill"}
          </div>
          <div
            onClick={() => {
              handleBarPrint();
            }}
            disabled={isButtonDisabled2}
            className={`basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] ${isButtonDisabled2 ? "bg-gray-200 " : "bg-[--c1]"}`}>
            {isButtonDisabled2 && <AiOutlineLoading3Quarters className="animate-spin mx-auto text-5xl" />}
            {!isButtonDisabled2 && "Print Bar"}
          </div>
          <div
            onClick={() => {
              handleKitchenPrint();
            }}
            disabled={isButtonDisabled}
            className={`basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${isButtonDisabled ? "bg-gray-200 " : "bg-[--c1]"}`}>
            {isButtonDisabled && <AiOutlineLoading3Quarters className="animate-spin mx-auto text-5xl" />}
            {!isButtonDisabled && "Print Kitchen"}
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
