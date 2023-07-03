import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLeft } from "react-icons/ai";
import Allergens from "../Modals/Allergens";

const MenuItemDetails = ({ user, item, basketItems, setBasketItems, menuitems }) => {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [modal, setModal] = useState(false);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const findItemCategory = (item) => {
    for (const category of menuitems) {
      const foundItem = category.items.find(
        (menuItem) => menuItem.name === item
      );
      if (foundItem) {
        if (category.name === "Breakfast") return 2;
        if (category.name === "Starters") return 1;
        if (category.name === "Mains") return 2;
        if (category.name === "Desserts") return 3;
        if (category.name === "Beverages") return 0;
        if (category.name === "Kids Starters") return 1;
        if (category.name === "Kids Mains") return 2;
      }
    }
    return null; // or handle the case when item is not found
  };

  const addToBasket = () => {
    const existingItem = basketItems.find(
      (basketItem) => basketItem.item === item.name
    );

    if (existingItem) {
      const updatedBasket = basketItems.map((basketItem) => {
        if (basketItem.item === item.name) {
          return {
            ...basketItem,
            qty: String(parseInt(basketItem.qty) + quantity),
          };
        }
        return basketItem;
      });
      setBasketItems(updatedBasket);
    } else {
      findItemCategory(item.name);
      const updatedBasket = [
        ...basketItems,
        {
          item: item.name,
          qty: String(quantity),
          course: findItemCategory(item.name),
        },
      ];
      setBasketItems(updatedBasket);
    }
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-20 bg-[--c60] flex flex-col overflow-auto">
      {modal && <Allergens data={item} modal={modal} setModal={setModal} />}
      <img
        src={"../." + item.img}
        className="h-[100px] w-[100%]"
        style={{ objectFit: "cover", overflow: "hidden" }}
      />
      <button className="mr-auto p-2 text-3xl" onClick={() => navigate(-1)}>
        <AiOutlineLeft />
      </button>

      <div className="p-4 flex flex-col">
        <p className="text-xl font-bold mb-2">{item.name}</p>
        <p className="text-sm mb-2 capitalize">
          {item.ingredients.map((itemz, index) => (
            <span key={index}>
              <span>{itemz}</span>
              {index !== item.ingredients.length - 1 && <span>, </span>}
            </span>
          ))}
        </p>

        <div className="border-2 p-4 flex flex-wrap gap-4 justify-center capitalize">
          <span>{item.cal} kcal</span>
          {item.tag &&
            item.tag.length > 0 &&
            item.tag.map((item, index) => <span key={index}>{item}</span>)}
        </div>

        <button
          onClick={() => setModal(!modal)}
          className="bg-[--c1] rounded mt-4 mx-auto px-6 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none max-w-[500px]"
        >
          Allergen Info
        </button>
      </div>
      <span className="grow"></span>

      <p className="text-center text-3xl font-bold">
        £{parseFloat(item.price).toFixed(2)}
      </p>
      <div className="flex gap-4 justify-center text-3xl items-center">
        <button
          className="px-4 py-2 rounded-full border-2"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="px-4 py-2 rounded-full border-2"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>

      <div className="flex overflow-hidden w-[90%] mx-auto">
        <button
          disabled={quantity < 1 ? true : false}
          onClick={addToBasket}
          className="animate-fadeUP1 w-[100%] bg-[--c1] rounded mx-6 my-4 px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

export default MenuItemDetails;
