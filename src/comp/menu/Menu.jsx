import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Menu.css";
import { getUser, getVenue } from "../../utils/authUser";
import { calculateTotal, calculateBasketQTY } from "../../utils/BasketUtils";
import VenueNTable from "./VenueNTable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { AiFillCaretRight, AiOutlineLeft } from "react-icons/ai";
import { BsFilterRight } from "react-icons/bs";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";

import MenuLeftSide from "./MenuLeftSide";
import MenuRightSide from "./MenuRightSide";

const Menu = ({ basketDiscount, setBasketDiscount, basketItems, menuitems, setBasketItems, searchValue, setSearchValue, venues, venueNtable, setVenueNtable }) => {
  useEffect(() => {
    if (venueNtable.table === "" || !venueNtable.table) return nav("/Tables");
  }, [venueNtable]);

  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const tempDisabled = () => {
    console.log(isButtonDisabled, "isButtonDisabled");
    if(isButtonDisabled) return
    setIsButtonDisabled(true);
    handlePrinting();
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

  const handleDeleteAll = () => {
    setBasketItems([]);
  };

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

  const handlePrinting = () => {
    let areAllPrinted = basketItems.some(item => item.printed == false)
    const updatedBasketItems = basketItems.map(item => {
      if (!item.printed) {
        return { ...item, printed: true };
      }
      return item;
    });
  
    setBasketItems(updatedBasketItems);

    if(areAllPrinted){
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
    
  }

  return (
    <>
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      <div className={`modal ${modal ? "fixed inset-0 bg-black/70 flex flex-col justify-center items-center z-20 p-4" : "hidden"}`}>
        <div className={`relative flex-flex-col bg-white/90 p-4 min-w-[300px] w-[600px]`}>
          <button className="block mr-auto p-2 mb-8 text-3xl animate-fadeUP1" onClick={() => setModal(!modal)} onTouchStart={() => setModal(!modal)}>
            ◀ Cancel
          </button>
          <p className="text-center text-3xl my-20">Apply Discount</p>
          <div className="flex flex-nowrap mb-20 text-center gap-4">
            <button onClick={() => setDiscount(5)} className="flex-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] border-b-2 border-b-black">
              5%
            </button>
            <button onClick={() => setDiscount(10)} className="flex-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] border-b-2 border-b-black">
              10%
            </button>
            <button onClick={() => setDiscount(25)} className="flex-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] border-b-2 border-b-black">
              25%
            </button>
            <button onClick={() => setDiscount(50)} className="flex-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] border-b-2 border-b-black">
              50%
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[100%]">
        <div className="grid grid-cols-[2fr_3fr] gap-1 rounded basis-[90%] overflow-y-scroll">
          <div className="h-[100%] w-[100%] rounded shadow-xl flex flex-col p-1 overflow-hidden">
            <div className="grid grid-cols-4 gap-2 h-[82px]">
              <button onClick={handleDeleteAll} className="text-sm bg-red-300 m-1 p-2 rounded-xl transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] flex flex-col justify-center items-center border-b-2 border-b-black ">
                <span>Delete ALL</span>
                <span>{totalProducts}</span>
              </button>
              <div className="tableNumber m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] border-b-2 border-b-black ">
                <p>Table</p>
                <p className="text-3xl">{venueNtable.table}</p>
              </div>
              <button
                onClick={() => {
                  setVenueNtable((prevValues) => ({ ...prevValues, table: null }));
                  console.log("dev**to check -> confirm merge if any items -> merge -> change table in db");
                }}
                className="text-sm bg-gray-300 m-1 p-2 rounded-xl transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90]  flex flex-col justify-center items-center border-b-2 border-b-black ">
                <span>Transfer</span>
                <span>Table</span>
              </button>
              <button
                onClick={() => {
                  setVenueNtable((prevValues) => ({ ...prevValues, table: null }));
                  console.log("dev**to change table in db");
                }}
                className="text-sm bg-gray-300 m-1 p-2 rounded-xl transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90]  flex flex-col justify-center items-center border-b-2 border-b-black ">
                <span>Open</span>
                <span>Table</span>
              </button>
            </div>

            <div className="MenuLeftSide flex flex-col overflow-hidden grow">
              <div className="MenuLeftSide flex flex-col overflow-y-scroll">
                <MenuLeftSide basketItems={basketItems} setBasketItems={setBasketItems} />
              </div>
              <div className="text-3xl text-end mt-auto flex justify-between">
                <div>
                  <span>Items: </span>
                  <span className="font-bold">{totalProducts}</span>
                </div>
                <div>
                  <span>Total: </span>
                  <span className="font-bold">£{basketTotal}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="MenuRightSide h-[100%] w-[100%] rounded shadow-xl p-1 flex flex-col overflow-hidden">
            <MenuRightSide menuitems={menuitems} basketItems={basketItems} setBasketItems={setBasketItems} />
          </div>
        </div>

        <div className="flex justify-end basis-[10%] col-span-2">
          {basketDiscount > 0 && <span className={`basis-[10%] border-b-2 border-b-black mr-auto transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-green-400`}>{basketDiscount}% Discount</span>}

          <button disabled={parseFloat(basketTotal) <= 0} onClick={() => nav("/Payment")} className={`basis-[10%] items-center border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${parseFloat(basketTotal) <= 0 ? "bg-gray-300 text-gray-400" : "bg-[--c1]"} `}>
            Pay Bill
          </button>
          <div className={`basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]`} onClick={() => console.log("dev**popup w/ custom item&price")}>
            Misc Item
          </div>
          <div className={`${basketDiscount > 0 ? "bg-[--c12] shadow-[inset_0px_4px_2px_0px_black]" : "bg-[--c1] "} basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold `} onClick={handleDiscount}>
            {basketDiscount > 0 ? "Remove Discount" : "Apply Discount"}
          </div>
          <div className={`basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]`} onClick={() => console.log("dev**do not print-> store table into the db")}>
            Store
          </div>
          <div onClick={()=>{tempDisabled();}} disabled={isButtonDisabled} className={`basis-[10%] border-b-2 border-b-black m-1 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold ${ isButtonDisabled ? "bg-gray-200 " : "bg-[--c1]" }`} >
            {isButtonDisabled && <AiOutlineLoading3Quarters className="animate-spin mx-auto text-5xl"/> }
            {!isButtonDisabled && "Print" }
          </div>
         
        </div>
      </div>
    </>
  );
};

export default Menu;
