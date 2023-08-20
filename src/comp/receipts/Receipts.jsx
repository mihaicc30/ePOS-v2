import React, { useState, useEffect, useRef } from "react";
import "./Receipts.css";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

const Receipts = () => {
  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const [receipts, setReceipts] = useState([]);
  const [searchReceipts, setSearchReceipts] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    searchInputRef.current.focus();

    const getReceipts = async () => {
      try {
        const query = await fetch(`${import.meta.env.VITE_API}receipts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            v: import.meta.env.VITE_G,
            email: user.email,
          }),
        });

        if (query.status === 200) {
          const response = await query.json();
          setReceipts(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getReceipts();
  }, [user]);

  const getUniqueYears = () => {
    const years = new Set(receipts.map((receipt) => receipt.year));
    return Array.from(years).filter((year) => year);
  };

  const getUniqueMonths = () => {
    const months = new Set(receipts.map((receipt) => receipt.month));
    return Array.from(months).filter((month) => month);
  };

  return (
    <div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll px-2">
      <div className="relative w-[100%] flex">
        <input ref={searchInputRef} name="venuesearchinput" type="text" placeholder="Receipt number..." className="w-[98%] mx-auto pl-10 pr-10 py-2 my-2 rounded" value={searchReceipts} onChange={(e) => setSearchReceipts(e.target.value)} />
        <span className="absolute top-[28px] left-4 -translate-y-3">🔍</span>
        <button onClick={() => setSearchReceipts("")} className={`absolute top-[28px] right-5 -translate-y-3 ${searchReceipts ? "" : "hidden"}`}>
          ✖
        </button>
      </div>

      {receipts.length < 1 && (
        <div>
          <p className="text-center my-auto under text-xl">You have no orders. </p>
          <p className="text-center my-auto under text-xl">
            Just check our delicious menu!
            <button className="bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none text-3xl" onClick={() => navigate("/Menu")}>
              📲
            </button>
          </p>
        </div>
      )}

      {getUniqueYears().map((year) => (
        <details className="pl-1" key={year}>
          <summary className="py-2 border-b-2 bg-[--c12]">{year}</summary>
          {getUniqueMonths().map((month) => (
            <details className="pl-1 bg-[#f5b06f3d]" key={month}>
              <summary>{month}</summary>
              {receipts
                .filter((receipt) => String(receipt.receiptNumber).includes(searchReceipts))
                .map((receipt, index) => {
                  if (receipt.year === year && receipt.month === month) {
                    return (
                      <div key={index} className="receipt border-t-2 border-b-2 my-4 text-sm bg-[--c30] py-2">
                        <details className="pl-5">
                          <summary>Receipt Number: {receipt.receiptNumber}</summary>
                          <div>
                            <p className="font-bold">Venue: {receipt.pubName}</p>
                            <p>Address: {receipt.address}</p>
                            <p>Phone: {receipt.phone}</p>
                            <p>Website: {receipt.website}</p>
                            <div className="grid grid-cols-[1fr_100px]">
                              <p className="font-bold">Date: {new Date(receipt.tableOpenAt).toLocaleString()}</p>
                            </div>
                            <div className="flex flex-1">
                              <table className="w-[100%]">
                                <thead>
                                  <tr className="border-2">
                                    <th className="border-2">Item</th>
                                    <th className="border-2">Quantity</th>
                                    <th className="border-2">Price</th>
                                    <th className="border-2">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {receipt.items.map((item, itemIndex) => (
                                    <tr key={itemIndex} className="text-center">
                                      <td className="line-clamp-2 border-b-2 border-l-2">{item.name}</td>
                                      <td className="border-b-2 border-l-2 border-r-2">{item.qty}</td>
                                      <td className="border-b-2 border-l-2 border-r-2">£{item.price.toFixed(2)}</td>
                                      <td className="border-b-2 border-l-2 border-r-2">£{(item.qty * item.price).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <p className="font-bold">Subtotal: £{receipt.subtotal.toFixed(2)}</p>
                            {receipt.discount > 0 && <p>Discount: {receipt.discount}%</p>}
                            <p className="font-bold">Total Amount: £{receipt.totalAmount.toFixed(2)}</p>
                            <p>VAT: £{receipt.vat.toFixed(2)}</p>
                            <p>
                              Payment: Cash: £{parseFloat(receipt.paymentMethod[0].cash).toFixed(2)}, Card: £{parseFloat(receipt.paymentMethod[0].card).toFixed(2)}, Voucher: £{parseFloat(receipt.paymentMethod[0].voucher).toFixed(2)}, Deposit: £{parseFloat(receipt.paymentMethod[0].deposit).toFixed(2)}
                            </p>
                            <p>
                              Change: £
                              {Math.abs(
                                (
                                  parseFloat(receipt.totalAmount) -
                                  parseFloat(
                                    Object.values(receipt.paymentMethod[0])
                                      .reduce((acc, val) => acc + val, 0)
                                      .toFixed(2)
                                  )
                                ).toFixed(2)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </details>
                      </div>
                    );
                  }
                  return null;
                })}
            </details>
          ))}
        </details>
      ))}
    </div>
  );
};

export default Receipts;
