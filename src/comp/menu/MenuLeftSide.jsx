import React, { useState } from "react";

const MenuLeftSide = ({ basketItems, setBasketItems }) => {
  //mimic db
  const [basket, setBasket] = useState([
    {
      qty: 22,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
    {
      qty: 1,
      name: "Pancake Pancake Pancake Pancake Pancake Pancake Pancake",
      price: 5.22,
    },
  ]);

  const handleIncrement = (index) => {
    const updatedBasket = [...basketItems];
    updatedBasket[index] = {
      ...updatedBasket[index],
      qty: updatedBasket[index].qty + 1,
    };
    setBasketItems(updatedBasket);
  };
  
  const handleDecrement = (index) => {
    const updatedBasket = [...basketItems];
    if (updatedBasket[index].qty > 1) {
      updatedBasket[index] = {
        ...updatedBasket[index],
        qty: updatedBasket[index].qty - 1,
      };
      setBasketItems(updatedBasket);
    }
  };

  const handleRemoveItem = (id) => {
    const updatedBasketItems = basketItems.filter((basketItem) => basketItem.id !== id);
    setBasketItems(updatedBasketItems);
  };

  return (
    <>
      {basketItems &&
        basketItems.map((menuItem, index) => (
          <div key={crypto.randomUUID()} className="item grid grid-cols-1 bg-gray-100 rounded m-1 p-2 select-none shadow-md">
            <div className="grid grid-cols-[50px_5fr_1fr]">
              <p className="itemQty text-4xl row-span-2">{menuItem.qty}</p>
              <p title={menuItem.name} className="itemName line-clamp-1">
                {menuItem.name}
              </p>
              <p>£{(menuItem.price * menuItem.qty).toFixed(2)}</p>

              <div className="flex justify-center flex-wrap gap-2 text-xs my-1 col-span-1">
                <button className="bg-red-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleRemoveItem(menuItem.id)}>Remove</button>
                <button className="bg-gray-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleDecrement(index)}>
                  ➖
                </button>
                <button className="bg-gray-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleIncrement(index)}>
                  ➕
                </button>
                <button className="bg-green-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md">+Message</button>
              </div>
            </div>
          </div>
        ))}
        {basketItems.length == 0 &&
          <p className="text-center">Basket is empty.</p>
        }
        <span className="grow"></span>
    </>
  );
};

export default MenuLeftSide;
