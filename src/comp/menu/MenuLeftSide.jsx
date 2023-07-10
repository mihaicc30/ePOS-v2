import React, { useState, useRef } from "react";

const MenuLeftSide = ({ basketItems, setBasketItems }) => {
  const [messageModal, openMessageModal] = useState(false);
  const [messageModalData, setMessageModalData] = useState(false);
  const modalMessageRef = useRef(null);

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

  const handleMessage = (msg, refID, name) => {
    if (msg) {
      const updatedBasket = basketItems.map((item) => {
        if (item.refID === refID) {
          return { ...item, message: false };
        }
        return item;
      });
      setBasketItems(updatedBasket);
      openMessageModal(false);
    } else {
      if (!messageModal) openMessageModal(!messageModal);
      setMessageModalData({ refID, name });
      setTimeout(() => {
        modalMessageRef.current.focus()
        
      }, 111);
    }
  };

  const handleAddMessage = () => {
    const message = modalMessageRef.current.value;
    const updatedBasket = basketItems.map((item) => {
      if (item.refID === messageModalData.refID) {
        return { ...item, message: message };
      }
      return item;
    });
    setBasketItems(updatedBasket);
    openMessageModal(false);
  };

  const handleEnterKey = (event) => {
    console.log("🚀 ~ file: MenuLeftSide.jsx:64 ~ handleEnterKey ~ event.keyCode:", event.keyCode);
    if (event.keyCode === 13) {
      event.preventDefault();
      handleAddMessage();
      // Perform your logic here when Enter key is pressed
      // For example, you can call a function or submit the form
    }
  };

  return (
    <>
      {basketItems &&
        basketItems
          .sort((a, b) => {
            if (a.printed !== b.printed) {
              return a.printed ? -1 : 1; // Sort by "printed" property
            } else {
              return new Date(a.date) - new Date(b.date); // Sort by date
            }
          })
          .map((menuItem, index) => (
            <div key={crypto.randomUUID()} onClick={() => console.log("printed?:", menuItem.printed, menuItem.date)} className={`item grid grid-cols-1  ${menuItem.printed ? "bg-blue-300/50" : "bg-gray-100"}  rounded p-2 select-none shadow-md`} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
              <div className={`grid grid-cols-[50px_5fr_1fr]`}>
                <p className="itemQty text-4xl row-span-2">{menuItem.qty}</p>
                <p title={menuItem.name} className="itemName line-clamp-1">
                  {menuItem.name}
                </p>
                <p>£{(menuItem.price * menuItem.qty).toFixed(2)}</p>

                <div className="flex justify-center flex-wrap gap-2 text-xs my-1 col-span-1">
                  <button className="bg-orange-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleRemoveItem(menuItem.id)}>
                    Remove
                  </button>
                  <button className="bg-gray-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleDecrement(index)}>
                    ➖
                  </button>
                  <button className="bg-gray-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleIncrement(index)}>
                    ➕
                  </button>
                  <button onClick={() => handleMessage(menuItem.message, menuItem.refID, menuItem.name)} className={`${menuItem.message ? "bg-red-300" : "bg-green-300"} px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                    {menuItem.message ? "-Message" : "+Message"}
                  </button>
                </div>
              </div>
              {menuItem.message && <i>{menuItem.message}</i>}
            </div>
          ))}
      {basketItems.length == 0 && <p className="text-center">Basket is empty.</p>}
      {messageModal && (
        <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
          <button className="absolute top-0 left-0 p-4 text-3xl animate-fadeUP1" onClick={() => openMessageModal(!messageModal)}>
            ◀ Cancel
          </button>

          <p className="text-center text-xl mt-20 border-b-2 border-b-[--c1]">Add Message Form</p>
          <p className="text-center mt-10">Add Message to {messageModalData.name}</p>

          <input ref={modalMessageRef} onKeyDown={handleEnterKey} type="text" defaultValue={``} className="border-b-2 border-b-black border-t-2 border-t-gray-200 rounded-xl p-4 mx-auto mb-12 text-center w-[80%]" placeholder="Type your message here.." />
          <button onClick={handleAddMessage} className="tableNumber mx-auto w-1/2 p-6 transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center text-sm justify-center font-semibold bg-[--c1] border-b-2 border-b-black ">
            Add ▶
          </button>
        </div>
      )}
      <span className="grow"></span>
    </>
  );
};

export default MenuLeftSide;
