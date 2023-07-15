import React, { useState, useEffect } from "react";
import { BsFilterRight } from "react-icons/bs";
import { processAllergenList, getStockColour } from "../../utils/BasketUtils";

const MenuRightSide = ({ lefty, menuitems, basketItems, setBasketItems }) => {
  // mimic db fetch - temporary

  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {}, [searchValue]);

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

    const itemCategory = menuitems.find((category) => category.category === menuType);
    const dbitem = itemCategory.items.find((dbitem) => dbitem.name === item.name);
    if (dbitem.stock >= 1) {
      // if over 100 will mean infinite stock
      if (dbitem.stock < 100) dbitem.stock -= 1;

      // to set DATABASE ID too! dont forget*
      let newBasketItem = {
        ...item,
        id: "will be unique db item menu id",
        qty: 1,
        refID: crypto.randomUUID(),
        category: menuType,
        printed: false,
        printedBy: false,
        printable: true,
        message: false,
        messageBy: false,
        isDeleted: false,
        isDeletedBy: false,
        dateAdded: new Date().toISOString(),
        addedBy: localStorage.getItem("displayName"),
        datePrinted: false,
      };
      setBasketItems([...basketItems, { ...newBasketItem }]);
    }
  };

  return (
    <>
      <div className="relative flex  mr-4 items-center max-[350px]:flex-wrap  max-[350px]:justify-center">
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
          className={`p-2 ${menuType2 === "" && searchValue === "" && menuType3 === "" && menuType4 === "" ? "bg-[--c3]" : "bg-[--c1]"} rounded-xl shadow-xl border-b-2 border-b-black transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] active:shadow-[inset_0px_4px_2px_black]`}>
          Clear Filters
        </button>
      </div>

      {/* categories */}
      <div className={`${searchValue !== "" ? "hidden" : "grid"} `} style={{ gridTemplateColumns: `repeat(${[...new Set(menuitems.map((item) => item.category))].length}, 1fr)` }}>
        {menuitems.map((item) => {
          return (
            <div key={crypto.randomUUID()} onClick={changeMenuType} className={`${menuType === item.category ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : "bg-[--c1]"} border-b-2 border-b-black m-1 p-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold `}>
              {item.category}
            </div>
          );
        })}
      </div>

      {/* subcategories */}
      {menuitems.map((item) => {
        const subcategories = [...new Set(item.items.map((item2) => item2.subcategory))];
        return (
          <div key={crypto.randomUUID()} className={`${item.category} transition ${menuType === item.category ? "" : "hidden"} ${searchValue !== "" ? "hidden" : "grid"}`} style={{ gridTemplateColumns: `repeat(${subcategories.length}, 1fr)` }}>
            {subcategories.map((subcat) => (
              <div key={crypto.randomUUID()} onClick={changeMenuType2} className={`${menuType2 === subcat ? "shadow-[inset_0px_4px_2px_black] bg-[--c12]" : " bg-[--c1]"} border-b-2 border-b-black m-1 px-1 py-2 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold`}>
                {subcat}
              </div>
            ))}
          </div>
        );
      })}

      {/* subcategories items */}
      <div className="flex flex-row flex-wrap overflow-y-scroll gap-2">
        {menuitems.flatMap((item) => {
          if (searchValue !== "") {
            return item.items.map((product, index) => {
              if (product.name.toLowerCase().includes(searchValue.toLowerCase()))
                return (
                  <div key={`${product.name}-${index}`} onClick={() => handleAddToMenu(product)} className="rounded h-[128px] w-[170px] p-2 flex flex-col shadow-xl transition duration-100 cursor-pointer hover:scale-[0.98] active:scale-[0.96] active:shadow-[inset_0px_2px_2px_black]">
                    <span className={`ml-auto px-2 rounded-bl-lg rounded-tr-lg text-end ${getStockColour(product.stock)}`}>{product.stock}</span>
                    <span className="line-clamp-2 h-[48px] font-bold">{product.name}</span>
                    <span>£{product.price}</span>
                    <span className="h-[24px]">{product.allergens}</span>
                  </div>
                );
            });
          } else {
            if (menuType !== item.category) return;
            return item.items.map((product, index) => {
              if (menuType2 !== product.subcategory && menuType2 !== "") return;
              return (
                <div key={`${item.name}-${product.name}-${index}`} onClick={() => handleAddToMenu(product)} className={`rounded h-[150px] p-2 w-[170px] flex flex-col shadow-xl transition duration-100 cursor-pointer ${product.stock >= 1 ? "hover:scale-[0.98] active:scale-[0.96] active:shadow-[inset_0px_2px_2px_black]" : "text-gray-300"}`}>
                  <div className="flex justify-between">
                    <span>£{product.price}</span>

                    <span className={`ml-auto px-2 rounded-bl-lg rounded-tr-lg text-end ${getStockColour(product.stock)}`}>{product.stock}</span>
                  </div>
                  <span className="line-clamp-2 h-[48px] font-bold">{product.name}</span>
                  <span className="mt-auto h-[24px]">{processAllergenList(product.allergensList)}</span>
                </div>
              );
            });
          }
        })}
      </div>

      <div className="flex flex-wrap grow content-start overflow-y-scroll"></div>
    </>
  );
};

export default MenuRightSide;