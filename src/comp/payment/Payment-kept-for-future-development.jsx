import React, { useState, useEffect } from "react";
import "./Payment.css";

const Payment = ({ user, basketItems, setBasketItems }) => {
  const [splitBill, setSplitBill] = useState([]);
  const [splitBillTotal, setSplitBillTotal] = useState(0);
  const [currentTable, setCurrentTable] = useState(null);
  const [splitCount, setSplitCount] = useState(1);
  const [totalSplitSum, setTotalSplitSum] = useState(0);
  const [totalPartsPaid, setTotalPartsPaid] = useState(0);

  const [computedBasket, setComputedBasket] = useState(0);
  const [computedBasketTotal, setComputedBasketTotal] = useState(0);

  useEffect(() => {
    setComputedBasket(basketItems);
  }, basketItems[localStorage.getItem('email')]);

  const handleIncrement = (index) => {
    console.log("dev**to check for access level");
    const updatedBasket = [...basketItems];
    updatedBasket[index] = {
      ...updatedBasket[index],
      qty: updatedBasket[index].qty + 1,
    };
    setBasketItems(updatedBasket);
  };

  const handleDecrement = (index) => {
    console.log("dev**to check for access level");
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
    console.log("dev**to check for access level");
    const updatedBasketItems = basketItems[localStorage.getItem('email')].filter((basketItem) => basketItem.id !== id);
    setBasketItems(updatedBasketItems);
  };

  const toggleTable = (TN) => {
    if (TN === currentTable) {
      setCurrentTable(null);
    } else {
      setCurrentTable(TN);
    }
  };

  const [basketTotal, setBasketTotal] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setBasketTotal(
      basketItems
        .reduce((total, item) => {
          return total + item.price * item.qty;
        }, 0)
        .toFixed(2)
    );

    setTotalProducts(
      basketItems[localStorage.getItem('email')].reduce((total, item) => {
        return total + item.qty;
      }, 0)
    );
  }, basketItems[localStorage.getItem('email')]);

  const handleItemMove = (id) => {
    const originalItem = basketItems[localStorage.getItem('email')].find((item) => item.id === id);
    const splitItem = splitBill.find((item) => item.id === id);
    const remainingQty = originalItem.qty - 1;
    const updatedOriginalItem = { ...originalItem, qty: remainingQty };

    if (splitItem) {
      let splitItem = splitBill.find((item) => item.id === id);
      let newsi = splitItem.qty + 1;
      setSplitBill((prevState) => prevState.map((item) => (item.id === id ? { ...item, qty: newsi } : item)));
    } else if (!splitItem) {
      let newSplitBillItem = { ...originalItem, qty: originalItem.qty - remainingQty };
      setSplitBill((prevState) => [...prevState, newSplitBillItem]);
    }
    if (remainingQty === 0) {
      setBasketItems((prevState) => prevState.filter((item) => item.id !== id));
    } else {
      setBasketItems((prevState) => prevState.map((item) => (item.id === id ? updatedOriginalItem : item)));
    }
  };

  const handleItemMoveReverse = (id) => {
    const originalItem = splitBill.find((item) => item.id === id);
    const splitItem = basketItems[localStorage.getItem('email')].find((item) => item.id === id);
    const remainingQty = originalItem.qty - 1;
    const updatedOriginalItem = { ...originalItem, qty: remainingQty };

    if (splitItem) {
      let splitItem = basketItems[localStorage.getItem('email')].find((item) => item.id === id);
      let newsi = splitItem.qty + 1;
      setBasketItems((prevState) => prevState.map((item) => (item.id === id ? { ...item, qty: newsi } : item)));
    } else if (!splitItem) {
      let newSplitBillItem = { ...originalItem, qty: originalItem.qty - remainingQty };
      setBasketItems((prevState) => [...prevState, newSplitBillItem]);
    }
    if (remainingQty === 0) {
      setSplitBill((prevState) => prevState.filter((item) => item.id !== id));
    } else {
      setSplitBill((prevState) => prevState.map((item) => (item.id === id ? updatedOriginalItem : item)));
    }
  };

  const handleSplitDecrement = () => {
    if (splitCount > 1) setSplitCount(splitCount - 1);
  };

  const handleSplitIncrement = () => {
    setSplitCount(splitCount + 1);
  };

  useEffect(() => {
    setSplitBillTotal(
      splitBill
        .reduce((total, item) => {
          return total + item.price * item.qty;
        }, 0)
        .toFixed(2)
    );
  }, [splitBill]);

  useEffect(() => {
    setTotalSplitSum((basketTotal / splitCount).toFixed(2));
  }, [totalSplitSum, splitCount, basketTotal, basketItems]);

  const [extra, setExtra] = useState(null); // service charge
  const [extra2, setExtra2] = useState(null); // tips
  return (
    <>
      <div className="grid grid-cols-[1fr_3fr_3fr_3fr] h-[100%] overflow-hidden">
        <div className="flex flex-col overflow-y-scroll">
          <p className="border-b-2 pb-2 mb-2 text-center font-bold">Active Tables</p>
          <p>No active tables.</p>
          <button onClick={() => toggleTable(1)} className={`${currentTable === 1 ? "bg-[--c1]" : "bg-[--c12]"} border-b-2 border-b-black shadow-md  p-2 my-2 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90]`}>
            Table 1 - £123.12 ▶
          </button>
          <button onClick={() => toggleTable(2)} className={`${currentTable === 2 ? "bg-[--c1]" : "bg-[--c12]"} border-b-2 border-b-black shadow-md  p-2 my-2 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90]`}>
            Table 2 - £323.12 ▶
          </button>
        </div>

        <div className="MenuLeftSide relative flex flex-col h-[100%] overflow-y-hidden">
          <p className="border-b-2 pb-2 mb-2 text-center font-bold">Ordered Items</p>
          {currentTable && (
            <div className="text-xl flex flex-nowrap justify-evenly">
              <div>
                <span>Items: </span>
                <span className="font-bold">{totalProducts}</span>
              </div>
              <div>
                <span>Total: </span>
                <span className="font-bold">£{basketTotal}</span>
              </div>
            </div>
          )}
          {currentTable && (
            <div className="grid grid-cols-2 mx-2 p-1 gap-2">
              <button onClick={() => console.log("dev**to create modal")} className={`${extra === "SC" ? "bg-[--c12]" : "bg-[--c1]"} border-b-2 border-b-black px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                {extra === "SC" ? "Remove Serv.Charge" : "Add Serv.Charge"}{" "}
              </button>
              <button onClick={() => console.log("dev**to create modal")} className={`${extra2 === "T" ? "bg-[--c12]" : "bg-[--c1]"} border-b-2 border-b-black px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                {extra2 === "T" ? "Remove Tips" : "Add Tips"}
              </button>
            </div>
          )}

          {currentTable && (
            <div className="grid grid-cols-1 mx-2 p-1 gap-2">
              <button onClick={() => console.log("dev**to create print bill")} className={`bg-[--c1] h-[50px] border-b-2 border-b-black px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                Print Bill
              </button>
            </div>
          )}
          <div className="MenuLeftSide flex flex-col flex-nowrap overflow-y-scroll">
            {currentTable &&
              basketItems[localStorage.getItem('email')].map((menuItem, index) => (
                <div key={crypto.randomUUID()} className="item grid grid-cols-1 bg-gray-100 rounded m-1 p-2 select-none shadow-md">
                  <div className="grid grid-cols-[50px_5fr_1fr]">
                    <p className="itemQty text-4xl row-span-2">{menuItem.qty}</p>
                    <p title={menuItem.name} className="itemName line-clamp-1">
                      {menuItem.name}
                    </p>
                    <p>£{(menuItem.price * menuItem.qty).toFixed(2)}</p>

                    <div className="flex justify-center flex-nowrap gap-2 text-xs my-1 col-span-1">
                      <button className="bg-red-300 px-2 py-1 mr-auto rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleRemoveItem(menuItem.id)}>
                        Remove
                      </button>
                      <button className="bg-gray-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleDecrement(index)}>
                        ➖
                      </button>
                      <button className="bg-gray-300 px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md" onClick={() => handleIncrement(index)}>
                        ➕
                      </button>

                      <button onClick={() => handleItemMove(menuItem.id)} className="bg-[--c12] px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md">
                        Add to Split
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {currentTable && (
          <div className="flex flex-col  overflow-y-hidden">
            <div className="MenuLeftSide relative flex flex-col h-[100%] overflow-y-hidden">
              <p className="border-b-2 pb-2 mb-2 text-center font-bold">Split Bill By Item</p>
              <p className="text-center text-xl">
                Split Value: <span className="text-xl font-bold">£{splitBillTotal}</span>{" "}
              </p>
              <div className="MenuLeftSide flex flex-col flex-nowrap overflow-y-scroll">
                {splitBill.map((menuItem, index) => (
                  <div key={crypto.randomUUID()} className="item grid grid-cols-1 bg-gray-100 rounded m-1 p-2 select-none shadow-md">
                    <div className="grid grid-cols-[50px_5fr_1fr]">
                      <p className="itemQty text-4xl row-span-2">{menuItem.qty}</p>
                      <p title={menuItem.name} className="itemName line-clamp-1">
                        {menuItem.name}
                      </p>
                      <p>£{(menuItem.price * menuItem.qty).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-center flex-nowrap gap-2 text-xs my-1 col-span-1">
                      <button onClick={() => handleItemMoveReverse(menuItem.id)} className="bg-[--c12] px-2 py-1 mr-auto rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md">
                        ◀ Move Back
                      </button>
                    </div>
                  </div>
                ))}
                {splitBill.length < 1 && <p className="text-center">No items added.</p>}
              </div>
            </div>

            <div className="grow shadow-md m-1 p-2 basis-1/2 grid grid-cols-1 grid-rows-6 justify-items-center">
              <p className="border-b-2 pb-2 mb-2 text-center font-bold">Split Bill By Parts</p>
              <div className="text-5xl flex justify-evenly w-[100%] items-center ">
                <button onClick={() => handleSplitDecrement()}>➖</button>
                <span>
                  {splitCount}
                  <span className="text-sm">people</span>
                </span>
                <button onClick={() => handleSplitIncrement()}>➕</button>
              </div>
              <p className="text-3xl">/</p>
              <p className="text-xl ">£{basketTotal}</p>
              <p className="text-5xl ">
                £{totalSplitSum}
                <span className="text-sm">each</span>
              </p>
            </div>
          </div>
        )}

        {currentTable && (
          <div className="MenuLeftSide relative flex flex-col h-[100%] overflow-y-hidden">
            <div className="flex flex-col overflow-y-scroll h-[100%]">
              <p className="border-b-2 pb-2 mb-2 text-center font-bold">Payment Options</p>
              <div className="grid grid-cols-1 grid-rows-6 gap-2 h-[90%]">
                <button disabled={splitBillTotal <= 0 ? true : false} className={`${splitBillTotal <= 0 ? "bg-[--c12] grayscale" : "bg-[--c1]"} text-xl border-b-2 border-b-black px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                  Pay Splitted Items <span className="font-bold">£{splitBillTotal}</span>
                </button>
                <button className={`${totalSplitSum <= 0 ? "bg-[--c12] grayscale" : "bg-[--c1]"} text-xl border-b-2 border-b-black px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                  Pay Splitted Parts <span className="font-bold">£{totalSplitSum}</span>
                </button>
                <button className={`${basketTotal <= 0 ? "bg-[--c12] grayscale" : "bg-[--c1]"} text-xl border-b-2 border-b-black px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                  Pay Whole Bill <span className="font-bold">£{basketTotal}</span>
                </button>
                <button className={`${totalPartsPaid <= 0 ? "bg-[--c12] grayscale" : "bg-[--c1]"} text-xl border-b-2 border-b-black px-2 py-1 rounded transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] shadow-md`}>
                  Pay Whats Left <span className="font-bold">£{totalPartsPaid}</span>
                </button>
                {/* <span className="col-span-2 row-span-2"></span> */}
                <span></span>
                <div className="col-span-1 border-b-2 rounded-xl border-b-[--c1] shadow-xl">
                  <p className="mt-auto text-center text-5xl text-bold">£{totalPartsPaid}</p>
                  <p className="mt-auto text-center text-3xl text-bold">Left to Pay</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Payment;
