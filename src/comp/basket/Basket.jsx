import React, { useEffect, useState } from "react";
import "./Basket.css";
import { calculateTotalPrice } from "../../utils/BasketUtils";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import Allergens from "../modals/Allergens";

const Basket = ({ menuitems, basketItems, setBasketItems, venueNtable, setVenueNtable }) => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const [computedBasket, setComputedBasket] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [modalAllergens, setModalAllergens] = useState(false);
  const [modalAllergensData, setModalAllergensData] = useState(false);

  useEffect(() => {
    if (!venueNtable.venue || !venueNtable.table) return navigate("/Menu");
  }, []);

  useEffect(() => {
    const totalPrice = calculateTotalPrice(basketItems);
    setTotalPrice(totalPrice);
  }, [basketItems]);

  const handleRemoveItem = (basketItem) => {
    if (basketItem.name === "Line") {
      const updatedBasketItems = basketItems.filter((bask_item) => bask_item.refID !== basketItem.refID);
      setBasketItems(updatedBasketItems);
      return;
    }

    const dbitem = menuitems.find((dbitem) => dbitem.name === basketItem.name);
    dbitem.stock += 1;
    const updatedBasketItems = basketItems.filter((bask_item) => bask_item.refID !== basketItem.refID);
    setBasketItems(updatedBasketItems);
  };

  const handleIncrement = (item) => {
    const updatedBasket = computedBasket.map((basketItem) => {
      if (basketItem.name === item.name) {
        const updatedQty = basketItem.qty + 1;
        return {
          ...basketItem,
          qty: updatedQty,
        };
      }
      return basketItem;
    });

    const updatedBasketItems = basketItems.map((basketItem) => {
      if (basketItem.item === item.name) {
        const updatedQty = parseInt(basketItem.qty) + 1;
        return {
          ...basketItem,
          qty: updatedQty.toString(),
        };
      }
      return basketItem;
    });

    setComputedBasket(updatedBasket);
    setBasketItems(updatedBasketItems);
  };

  const handleDecrement = (item) => {
    if (item.qty == 1) {
      const updatedBasket = computedBasket.filter((basketItem) => basketItem.name !== item.name);
      const updatedBasketItems = basketItems.filter((basketItem) => basketItem.item !== item.name);
      setComputedBasket(updatedBasket);
      setBasketItems(updatedBasketItems);
    } else {
      const updatedBasket = computedBasket.map((basketItem) => {
        if (basketItem.name === item.name && basketItem.qty > 0) {
          const updatedQty = basketItem.qty - 1;
          return {
            ...basketItem,
            qty: updatedQty,
          };
        }
        return basketItem;
      });

      const updatedBasketItems = basketItems.map((basketItem) => {
        if (basketItem.item === item.name && parseInt(basketItem.qty) > 0) {
          const updatedQty = parseInt(basketItem.qty) - 1;
          return {
            ...basketItem,
            qty: updatedQty.toString(),
          };
        }
        return basketItem;
      });

      setComputedBasket(updatedBasket);
      setBasketItems(updatedBasketItems);
    }
  };

  const getUniqueCourses = (basket) => {
    const uniqueCourses = basketItems.reduce((courses, item) => {
      if (!courses.includes(item.course)) {
        courses.push(item.course);
      }
      return courses;
    }, []);

    return uniqueCourses.sort((a, b) => a - b);
  };

  const handleCourseChange = (itemz, e) => {
    const updatedBasketItems = basketItems.map((item) => {
      if (item.item === itemz) {
        return {
          ...item,
          course: parseInt(e),
        };
      }
      return item;
    });
    setBasketItems(updatedBasketItems);
  };

  const handleLocationChange = () => {
    console.log("Changing location and table.");
    setVenueNtable({ venue: null, table: null });
    navigate("/Menu");
    return;
  };

  const handleNavigation = () => {
    const data = {
      totalPrice: totalPrice,
      computedBasket: computedBasket,
    };

    navigate("/Payment", { state: data });
  };

  return (
    <div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll flex flex-col">
      {modalAllergens && <Allergens data={modalAllergensData} modal={modalAllergens} setModal={setModalAllergens} />}
      <div className="flex flex-col text-center my-4 pb-4 border-b-2 text-xl">
        <p>{venueNtable.venue ? venueNtable.venue.name : null}</p>
        <p className="text-xs">{venueNtable.venue ? venueNtable.venue.address : null}</p>
        <p>Table: {venueNtable.table ? venueNtable.table : null}</p>
        <p className="text-xs">
          <span className="underline">Not here?</span>
          <span onClick={handleLocationChange} className="text-xs bg-[--c1] rounded px-3 text-center font-bold border-b-2 border-b-[--c2] mx-1 text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
            Change
          </span>
        </p>
      </div>
      <div className="products flex flex-col gap-4 px-4 grow">
        {basketItems.some((item) => item.subcategory_course === 0) && <span className="border-b-2 border-gray-400">Beverage</span>}
        {basketItems
          .filter((item) => item.subcategory_course === 0)
          .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
          .map((menuItem, index) => (
            <div key={crypto.randomUUID()} className={` group  item flex flex-col rounded p-2 select-none shadow-md `} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
              <div className="flex flex-col">
                <div className={`flex basis-[100%] font-bold`}>
                  <div className="flex flex-col justify-start items-start  basis-[100%] ">
                    <span title={menuItem.name} className={`itemName line-clamp-1 w-[100%]  `}>
                      <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                      {menuItem.name}
                    </span>
                  </div>
                  <div className={`flex justify-end flex-nowrap gap-4 text-xs my-1`}>
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
              </div>
            </div>
          ))}
        {basketItems.some((item) => item.subcategory_course === 1) && <span className="border-b-2 border-gray-400">Starter</span>}
        {basketItems
          .filter((item) => item.subcategory_course === 1)
          .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
          .map((menuItem, index) => (
            <div key={crypto.randomUUID()} className={` group  item flex flex-col rounded p-2 select-none shadow-md `} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
              <div className="flex flex-col">
                <div className={`flex basis-[100%] font-bold`}>
                  <div className="flex flex-col justify-start items-start  basis-[100%] ">
                    <span title={menuItem.name} className={`itemName line-clamp-1 w-[100%]  `}>
                      <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                      {menuItem.name}
                    </span>
                  </div>
                  <div className={`flex justify-end flex-nowrap gap-4 text-xs my-1`}>
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
              </div>
            </div>
          ))}
        {basketItems.some((item) => item.subcategory_course === 2) && <span className="border-b-2 border-gray-400">Main</span>}
        {basketItems
          .filter((item) => item.subcategory_course === 2)
          .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
          .map((menuItem, index) => (
            <div key={crypto.randomUUID()} className={` group  item flex flex-col rounded p-2 select-none shadow-md `} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
              <div className="flex flex-col">
                <div className={`flex basis-[100%] font-bold`}>
                  <div className="flex flex-col justify-start items-start  basis-[100%] ">
                    <span title={menuItem.name} className={`itemName line-clamp-1 w-[100%]  `}>
                      <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                      {menuItem.name}
                    </span>
                  </div>
                  <div className={`flex justify-end flex-nowrap gap-4 text-xs my-1`}>
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
              </div>
            </div>
          ))}

        {basketItems.some((item) => item.subcategory_course === 3) && <span className="border-b-2 border-gray-400">Desert</span>}
        {basketItems
          .filter((item) => item.subcategory_course === 3)
          .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
          .map((menuItem, index) => (
            <div key={crypto.randomUUID()} className={` group  item flex flex-col rounded p-2 select-none shadow-md `} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
              <div className="flex flex-col">
                <div className={`flex basis-[100%] font-bold`}>
                  <div className="flex flex-col justify-start items-start  basis-[100%] ">
                    <span title={menuItem.name} className={`itemName line-clamp-1 w-[100%]  `}>
                      <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                      {menuItem.name}
                    </span>
                  </div>
                  <div className={`flex justify-end flex-nowrap gap-4 text-xs my-1`}>
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
              </div>
            </div>
          ))}
        {basketItems.length == 0 && <p className="text-center my-10">Basket is empty.</p>}
      </div>

      <p className="text-3xl text-center pt-4 border-t-2">TOTAL £{totalPrice}</p>
      <button disabled={parseFloat(totalPrice) <= 0} onClick={handleNavigation} className="bg-[--c1] rounded px-3 text-center py-3 mx-4 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
        Payment
      </button>
    </div>
  );
};

export default Basket;
