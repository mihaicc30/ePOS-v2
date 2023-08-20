import React, { useState, useEffect } from "react";

import { auth, db, logout } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

import "./Menu.css";
import VenueNTable from "./VenueNTable";

import { AiFillCaretRight, AiOutlineLeft } from "react-icons/ai";
import { BsFilterRight } from "react-icons/bs";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import MenuItem from "./MenuItem";
import { BrowserRouter, Routes, Route, Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { grabProducts } from "../../utils/grabProducts";

const Menu = ({ setBasketItems, basketItems, menuitems, toggleGrid, setToggleGrid, toggleFilters, setToggleFilters, searchValue, setSearchValue, selectedKCal, setSelectedKCal, selectedDietary, setSelectedDietary, venues, venueNtable, setVenueNtable }) => {
  const nav = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();
  const isBaseRoute = location.pathname === "/menu";

  useEffect(()=>{
    localStorage.setItem('venueID', venueNtable.venue)
    localStorage.setItem('tableID', venueNtable.table)
    localStorage.setItem('email', user.email)
    localStorage.setItem('displayName', "Customer-App")
  },[user, venueNtable])

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const [menuType, setMenuType] = useState("Beverages");
  const [menuType2, setMenuType2] = useState("");
  const [menuType3, setMenuType3] = useState("");
  const [menuType4, setMenuType4] = useState("");

  // filter for beverages/food/barsnacks
  const changeMenuType = (e) => {
    setMenuType2("");
    setMenuType3("");
    setMenuType(e.target.innerText);
  };

  // filter for type of beverage
  const changeMenuType2 = (e) => {
    if (e.target.innerText === menuType2) {
      setMenuType2("");
      setMenuType3("");
    } else {
      setMenuType2(e.target.innerText);
    }
  };

  // filter for type of food
  const changeMenuType3 = (e) => {
    if (e.target.innerText === menuType3) {
      setMenuType3("");
    } else {
      setMenuType3(e.target.innerText);
    }
  };

  // filter for type of bar snack
  const changeMenuType4 = (e) => {
    if (e.target.innerText === menuType3) {
      setMenuType3("");
    } else {
      setMenuType3(e.target.innerText);
    }
  };

  const handleAddToMenu = (item) => {
    const id = crypto.randomUUID();
    const message = "";

    const dbitem = menuitems.find((dbitem) => dbitem.name === item.name);
    if (dbitem.stock >= 1) {
      // if over 100 will mean infinite stock
      if (dbitem.stock < 100) dbitem.stock -= 1;
      // to set DATABASE ID too! dont forget*
      let newBasketItem = {
        ...item,
        id: "will be unique db item menu id",
        qty: 1,
        refID: crypto.randomUUID(),
        printed: false,
        printedBy: false,
        printable: true,
        message: false,
        messageBy: false,
        isDeleted: false,
        isDeletedBy: false,
        dateAdded: new Date().toISOString("en-GB"),
        addedBy: "Customer-App",
        datePrinted: false,
      };

      setBasketItems([...basketItems, { ...newBasketItem }]);
    }
  };

  if (!venueNtable.venue || !venueNtable.table) return <VenueNTable venues={venues} venueNtable={venueNtable} setVenueNtable={setVenueNtable} />;

  return (
    <div className={`basis-[80%] grid grid-cols-1 grid-rows-[50px_50px_50px_1fr] bg-[--c60] z-10 ${isBaseRoute ? "overflow-y-scroll" : "overflow-y-hidden"} relative`}>
      {!venueNtable.venue || (!venueNtable.table && <VenueNTable venues={venues} venueNtable={venueNtable} setVenueNtable={setVenueNtable} />)}

      <>
        <div className="relative flex-[10px] flex mr-4 items-center max-[350px]:flex-wrap  max-[350px]:justify-center">
          <div className="relative grow mx-4 overflow-hidden">
            <input type="text" placeholder="Search..." className="w-[100%] mx-auto pl-10 pr-10 py-2 my-2 rounded" value={searchValue} onChange={handleInputChange} />
            <span className="absolute top-[28px] left-2 -translate-y-3">🔍</span>
            <button
              onClick={() => setSearchValue("")}
              className={`absolute top-[28px] right-5 -translate-y-3 ${searchValue ? "" : "hidden"}
									`}>
              ✖
            </button>
          </div>
          <button
            disabled={menuType2 === "" && menuType3 === "" && menuType4 === "" && searchValue === ""}
            onClick={() => {
              setSearchValue("");
              setMenuType2("");
              setMenuType3("");
              setMenuType4("");
            }}
            className={`p-2 ${menuType2 === "" && searchValue === "" && menuType3 === "" && menuType4 === "" ? "bg-gray-200 text-gray-400" : "bg-[--c1]"} rounded-xl shadow-xl border-b-2 border-b-black transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] active:shadow-[inset_0px_4px_2px_black]`}>
            Clear Filters
          </button>
        </div>

        {/* categories */}
        <div className={`${searchValue !== "" ? "hidden" : "flex"} flex-nowrap overflow-x-auto w-[100svw] p-2 items-center overflow-y-hidden flex-[10px]`}>
          {[...new Set(menuitems.map((item) => item.category))].map((item) => {
            return (
              <div key={crypto.randomUUID()} onClick={changeMenuType} className={`${menuType === item ? "shadow-[inset_0px_4px_2px_black] overflow-y-hidden bg-[--c12]" : "bg-[--c1]"} min-w-[200px] whitespace-nowrap border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-lg flex flex-col text-center text-sm justify-center font-semibold `}>
                {item}
              </div>
            );
          })}
        </div>

        {/* subcategories */}
        <div className={`transition gap-4 flex flex-nowrap overflow-x-auto w-[100svw] p-2 items-center overflow-y-hidden flex-[10px]`}>
          {[...new Set(menuitems.filter((item) => item.category === menuType).map((item) => item.subcategory))].map((item) => {
            return (
              <div key={crypto.randomUUID()} onClick={changeMenuType2} className={` ${menuType2 === item ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : " bg-[--c1]"} min-w-[150px] h-[100%] border-b-2 border-b-black  transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-lg text-center text-sm font-semibold  overflow-y-hidden flex flex-col justify-center items-center`}>
                {item}
              </div>
            );
          })}
        </div>

        {/* subcategories items */}
        <div className="flex border-2 flex-wrap overflow-y-scroll gap-2 pb-4 content-start">
          {menuitems.map((item, index) => {
            if (searchValue !== "") {
              if (item.name.toLowerCase().includes(searchValue.toLowerCase()))
                return (
                  <div key={`${item.name}-${index}`} onClick={() => handleAddToMenu(item)} className={`menuItemBox h-[150px] rounded p-2 flex flex-col shadow-lg transition duration-100 cursor-pointer hover:scale-[0.98] active:scale-[0.96] active:shadow-[inset_0px_2px_2px_black]`}>
                    {/* <span className={`ml-auto px-2 rounded-bl-lg rounded-tr-lg text-end ${getStockColour(item.stock)}`}>{item.stock}</span> */}
                    <span className="line-clamp-2 h-[48px] font-[600]">{item.name}</span>
                    <span>£{item.price}</span>
                    <span className="h-[24px]">{item.allergens}</span>
                  </div>
                );
            } else {
              if (menuType !== item.category) return;
              if (menuType2 !== item.subcategory && menuType2 !== "") return;
              return (
                <div key={`${item.name}-${item.name}-${index}`} onClick={() => handleAddToMenu(item)} className={`menuItemBox h-[150px] flex-[16%] max-w-[16%] max-lg:flex-[19%] max-lg:max-w-[19%] max-md:flex-[24%] max-md:max-w-[24%] max-sm:flex-[48%] max-sm:max-w-[48%]  rounded p-2 flex flex-col shadow-lg transition duration-100 cursor-pointer ${item.stock >= 1 ? "hover:scale-[0.98] active:scale-[0.96] active:shadow-[inset_0px_2px_2px_black]" : "text-gray-300"}`}>
                  <div className="flex justify-between">
                    <span>£{item.price}</span>

                    {/* <span className={`ml-auto px-2 rounded-bl-lg rounded-tr-lg text-end ${getStockColour(item.stock)}`}>{item.stock}</span> */}
                  </div>
                  <span className="line-clamp-2 h-[48px] font-[600]">{item.name}</span>
                </div>
              );
            }
          })}
        <div className="flex flex-wrap grow content-start overflow-y-scroll w-[100%]"></div>
        </div>

      </>
    </div>
  );
};

export default Menu;
