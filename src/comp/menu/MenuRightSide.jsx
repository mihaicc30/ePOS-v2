import React, { useState } from "react";
import { BsFilterRight } from "react-icons/bs";

const MenuRightSide = () => {
  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const [menuType, setMenuType] = useState("Beverage");
  const changeMenuType = (e) => {
    setMenuType(e.target.innerText);
  };

  return (
    <>
      <div className="relative flex  mr-4 items-center max-[350px]:flex-wrap  max-[350px]:justify-center">
        <div className="relative grow mx-4">
          <input type="text" placeholder="Search..." className="w-[100%] mx-auto pl-10 pr-10 py-2 my-2 rounded" value={searchValue} onChange={handleInputChange} />
          <span className="absolute top-[28px] left-2 -translate-y-3">🔍</span>
          <button
            onClick={() => setSearchValue("")}
            className={`absolute top-[28px] right-5 -translate-y-3 ${searchValue ? "" : "hidden"}
									`}>
            ✖
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4">
        <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
          Beverage
        </div>
        <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
          Starter
        </div>
        <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
          Main
        </div>
        <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
          Desert
        </div>

        {menuType === "Beverage" ? (
          <div className="Beverages transition animate-fadeUP1">
              <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
                Lager
              </div>
          </div>
        ) : (
          <div className="other transition animate-fadeUP1 flex flex-nowrap overflow-x-scroll w-[100%] col-span-4">
            <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
              Breakfast
            </div>
            <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
              Starter
            </div>
            <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
              Main
            </div>
            <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
              Desert
            </div>
            <div onClick={changeMenuType} className="border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1]">
              Special
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuRightSide;
