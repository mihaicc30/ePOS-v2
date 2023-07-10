import React, { useState, useRef } from "react";
import { AiOutlineLeft, AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MenuLeftSide = ({ basketItems, setBasketItems }) => {
  const [messageModal, openMessageModal] = useState(false);
  const [messageModalData, setMessageModalData] = useState(false);
  const modalMessageRef = useRef(null);

  // const handleIncrement = (index) => {
  //   const updatedBasket = [...basketItems];
  //   updatedBasket[index] = {
  //     ...updatedBasket[index],
  //     qty: updatedBasket[index].qty + 1,
  //   };
  //   setBasketItems(updatedBasket);
  // };

  // const handleDecrement = (index) => {
  //   const updatedBasket = [...basketItems];
  //   if (updatedBasket[index].qty > 1) {
  //     updatedBasket[index] = {
  //       ...updatedBasket[index],
  //       qty: updatedBasket[index].qty - 1,
  //     };
  //     setBasketItems(updatedBasket);
  //   }
  // };

  const handleCourseChange = (refID, value) => {
    const updatedBasketItems = basketItems[localStorage.getItem("email")].map((item) => {
      if (item.refID === refID) {
        return {
          ...item,
          subcategory_course: parseInt(value),
        };
      }
      return item;
    });
    setBasketItems((prevState) => ({
      ...prevState,
      [localStorage.getItem("email")]: updatedBasketItems,
    }));
  };

  const handleRemoveItem = (refID, printed) => {
    if (printed) console.log("dev**to check level access as item is already printed.");
    const updatedBasketItems = basketItems[localStorage.getItem("email")].filter((basketItem) => basketItem.refID !== refID);
    console.log(updatedBasketItems);
    setBasketItems((prevState) => ({
      ...prevState,
      [localStorage.getItem("email")]: updatedBasketItems,
    }));
  };

  const handleMessage = (msg, refID, name, printed) => {
    if (printed) {
      toast.error(`Denied. Item has already been printed.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (msg) {
      const updatedBasket = basketItems[localStorage.getItem("email")].map((item) => {
        if (item.refID === refID) {
          return { ...item, message: false };
        }
        return item;
      });
      setBasketItems((prevState) => ({
        ...prevState,
        [localStorage.getItem("email")]: updatedBasket,
      }));
      openMessageModal(false);
    } else {
      if (!messageModal) openMessageModal(!messageModal);
      setMessageModalData({ refID, name });
      setTimeout(() => {
        modalMessageRef.current.focus();
      }, 111);
    }
  };

  const handleAddMessage = () => {
    const message = modalMessageRef.current.value;
    if (message !== "") {
      const updatedBasket = basketItems[localStorage.getItem("email")].map((item) => {
        if (item.refID === messageModalData.refID) {
          return { ...item, message: message, messageBy: localStorage.getItem("email") };
        }
        return item;
      });
      setBasketItems((prevState) => ({
        ...prevState,
        [localStorage.getItem("email")]: updatedBasket,
      }));
    }
    openMessageModal(false);
  };

  const handleEnterKey = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleAddMessage();
      // Perform your logic here when Enter key is pressed
      // For example, you can call a function or submit the form
    }
  };

  const getUniqueCourses = () => {
    let basket = basketItems[localStorage.getItem("email")] || [];
    const uniqueCourses = [...new Set(basket.map((item2) => item2.subcategory_course))];
    return uniqueCourses.sort((a, b) => a - b);
  };

  return (
    <>
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      {getUniqueCourses().map((course) => (
        <div key={course}>
          {course < 1 ? <p className="border-t-4 px-4 mt-4 border-t-orange-300">Beverages</p> : <p className="border-t-4 px-4 mt-4 border-t-orange-300">Course {course}</p>}
          {basketItems[localStorage.getItem("email")]
            .filter((menuItem) => menuItem.subcategory_course === course)
            .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
            .map((menuItem, index) => (
              <div key={crypto.randomUUID()} onClick={() => console.log("printed?:", menuItem.printed, menuItem.dateAdded)} className={`item grid grid-cols-1 ${menuItem.printed ? "bg-blue-300/50" : "bg-gray-100"} rounded p-2 select-none shadow-md`} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
                <div className="grid grid-cols-[5fr_1fr]">
                  {/* <p className="itemQty text-4xl row-span-2">{menuItem.qty}</p> */}
                  <p title={menuItem.name} className="itemName line-clamp-1">
                    {menuItem.name}
                  </p>
                  <p>£{(menuItem.price * menuItem.qty).toFixed(2)}</p>

                  <div className="flex justify-center flex-wrap gap-4 text-xs my-1 col-span-1">
                    <div className="flex flex-col gap-2 mr-auto">
                      {menuItem.subcategory_course > 0 && (
                        <select className="appearance-none bg-[--c1] rounded px-3 text-center font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" name="courseNumber" defaultValue={menuItem.subcategory_course} onChange={(event) => handleCourseChange(menuItem.refID, event.target.value)}>
                          {getUniqueCourses().map((course, index) => {
                            if (course !== 0)
                              return (
                                <option className="text-center" value={course} key={crypto.randomUUID()}>
                                  {course}
                                </option>
                              );
                          })}
                          <option className="text-center" value={getUniqueCourses()[getUniqueCourses().length - 1] + 1} key={crypto.randomUUID()}>
                            {getUniqueCourses()[getUniqueCourses().length - 1] + 1}
                          </option>
                        </select>
                      )}
                    </div>

                    <button className="bg-orange-300 px-2 py-3 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleRemoveItem(menuItem.refID, menuItem.printed)}>
                      Remove
                    </button>

                    <button onClick={() => handleMessage(menuItem.message, menuItem.refID, menuItem.name, menuItem.printed)} className={`${menuItem.message ? "bg-red-300" : "bg-green-300"} ${menuItem.printed ? "hidden" : ""} px-2 py-3 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                      {menuItem.message ? "-Message" : "+Message"}
                    </button>
                  </div>
                </div>
                {menuItem.message && <i>{menuItem.message}</i>}
              </div>
            ))}
        </div>
      ))}

      {basketItems[localStorage.getItem("email")]?.length == 0 && <p className="text-center">Basket is empty.</p>}
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
