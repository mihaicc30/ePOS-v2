import React, { useState } from "react";


const MenuLeftSide = () => {
  
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
  ])

  const handleIncrement = (index) => {
    const updatedBasket = [...basket];
    updatedBasket[index].qty += 1;
    setBasket(updatedBasket);
  };

  const handleDecrement = (index) => {
    const updatedBasket = [...basket];
    if (updatedBasket[index].qty > 1) {
      updatedBasket[index].qty -= 1;
      setBasket(updatedBasket);
    }
  };

  return (
    <>
      {basket &&
        basket.map((product, index) => {
          return (
            <div key={index} className="item grid grid-cols-1 bg-gray-100 rounded m-1 p-2 select-none shadow-md">
              <div className="grid grid-cols-[50px_5fr_1fr]">
                <p className="itemQty text-4xl row-span-2">{product.qty}</p>
                <p title={product.name} className="itemName line-clamp-1">
                  {product.name}
                </p>
                <p>£{(product.price * product.qty).toFixed(2)}</p>

                <div className="flex justify-center flex-wrap gap-2 text-xs my-1 col-span-1">
                  <button className="bg-red-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md">Remove</button>
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
          );
        })}
    </>
  );
};

export default MenuLeftSide;
