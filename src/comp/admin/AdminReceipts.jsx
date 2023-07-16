import React, { useState, useEffect, useRef } from "react";

const AdminReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [searchReceipts, setSearchReceipts] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current.focus();

    const getReceipts = async () => {
      try {
        const query = await fetch(`${import.meta.env.VITE_API}receipts-pos`, {
          method: "POST",
          headers: {
            
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            v: import.meta.env.VITE_G,
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
  }, []);

  const getUniqueYears = () => {
    const years = new Set(receipts.map((receipt) => receipt.year));
    return Array.from(years).filter((year) => year);
  };

  const getUniqueMonths = () => {
    const months = new Set(receipts.map((receipt) => receipt.month));
    return Array.from(months).filter((month) => month);
  };


  return (
    <div className="flex flex-col">
      <p className="text-xl font-bold p-2 underline">Receipts</p>
      <div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll px-2">
        <div className="relative w-[100%] flex">
          <input ref={searchInputRef} name="venuesearchinput" type="text" placeholder="Receipt number..." className="w-[98%] mx-auto pl-10 pr-10 py-2 my-2 rounded" value={searchReceipts} onChange={(e) => setSearchReceipts(e.target.value)} />
          <span className="absolute top-[28px] left-4 -translate-y-3">🔍</span>
          <button onClick={() => setSearchReceipts("")} className={`absolute top-[28px] right-5 -translate-y-3 ${searchReceipts ? "" : "hidden"}`}>
            ✖
          </button>
        </div>
{/* 
        {receipts.length < 1 && (
          <div>
            <p className="text-center my-auto under text-xl">You have no orders. </p>
          
          </div>
        )} */}

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
                              <p className="font-bold">Date: {receipt.dateTime}</p>
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
                                        <td className="line-clamp-2 border-2">{item.name}</td>
                                        <td className="border-2">{item.qty}</td>
                                        <td className="border-2">£{item.price}</td>
                                        <td className="border-2">£{(item.qty * item.price).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <p>VAT: £{receipt.vat.toFixed(2)}</p>
                              <p className="font-bold">Total Amount: £{receipt.totalAmount.toFixed(2)}</p>
                              <p>Payment Method: {receipt.paymentMethod}</p>
                              <p>Card Number: {receipt.cardNumber}</p>
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
    </div>
  );
};

export default AdminReceipts;
