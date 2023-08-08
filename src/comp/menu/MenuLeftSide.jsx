import React, { useState, useRef } from "react";
import { AiOutlineLeft, AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import { TbInfoTriangle } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Allergens from "../modals/Allergens";

const MenuLeftSide = ({ lefty, basketItems, setBasketItems, menuitems, selectedItem, setSelectedItem }) => {
  const [modalAllergens, setModalAllergens] = useState(false);
  const [modalAllergensData, setModalAllergensData] = useState(false);

  const handleCourseChange = (refID, value) => {
    const updatedBasketItems = basketItems.map((item) => {
      if (item.refID === refID) {
        return {
          ...item,
          subcategory_course: parseInt(value),
        };
      }
      return item;
    });
    setBasketItems(updatedBasketItems);
  };

  const handleRemoveItem = (basketItem) => {
    if (basketItem.name === "Line") {
      const updatedBasketItems = basketItems.filter((bask_item) => bask_item.refID !== basketItem.refID);
      setBasketItems(updatedBasketItems);
      return;
    }
    if (basketItem.printed) console.log("dev**to check level access as item is already printed.");

    const dbitem = menuitems.find((dbitem) => dbitem.name === basketItem.name);
    dbitem.stock += 1;
    const updatedBasketItems = basketItems.filter((bask_item) => bask_item.refID !== basketItem.refID);
    setBasketItems(updatedBasketItems);
  };

  const getSelectedItem = (item,e) => {
    if (item.name === "Line" || e.target.className.startsWith("btn")) return;
    if (item.refID === selectedItem.refID) return setSelectedItem({});
    setSelectedItem(item);
  };

  return (
    <>
      {modalAllergens && <Allergens data={modalAllergensData} modal={modalAllergens} setModal={setModalAllergens} />}
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>

      {basketItems
        .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
        .map((menuItem, index) => (
          <div key={crypto.randomUUID()} className={` group  item flex flex-col ${menuItem.printed ? "bg-blue-300/50" : "bg-gray-100"} rounded p-2 select-none shadow-md ${selectedItem.refID === menuItem.refID && menuItem.name !== "Line" ? "bg-orange-300" : ""}`} onClick={(e) => getSelectedItem(menuItem,e)} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
            <div className="flex flex-col">
              {menuItem.name === "Line" ? (
                <div className={`flex basis-[100%] ${lefty ? "flex-row-reverse" : ""} justify-end items-center relative`}>
                  <span className="border-y-2 border-y-black/50 w-[100%] rounded-lg my-4"></span>
                  <button className=" bg-red-300 p-1 text-xs h-[24px] w-[32px] rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleRemoveItem(menuItem)}>
                    ❌
                  </button>
                </div>
              ) : (
                <>
                  <div className={`flex basis-[100%] ${lefty ? "flex-row-reverse" : ""} font-bold`}>
                    <div className="flex flex-col justify-start items-start  basis-[100%] ">
                      <span title={menuItem.name} className={`itemName line-clamp-1 w-[100%] ${lefty ? "text-end" : "text-start"} `}>
                        <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                        {menuItem.name}
                      </span>
                    </div>
                    <div className={`flex justify-end flex-nowrap ${lefty ? "flex-row-reverse" : ""} flex-wrap gap-4 text-xs my-1`}>
                      <button
                        className="btnSPEC bg-orange-100 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md"
                        onClick={() => {
                          setModalAllergensData(menuItem);
                          setModalAllergens(!modalAllergens);
                        }}>
                        SPEC
                      </button>

                      <button className="btnDEL bg-red-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleRemoveItem(menuItem)}>
                        ❌
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {menuItem.message && <i>{menuItem.message}</i>}
          </div>
        ))}

      {basketItems.length == 0 && <p className="text-center">Basket is empty.</p>}

      <span className="grow"></span>
    </>
  );
};

export default MenuLeftSide;
