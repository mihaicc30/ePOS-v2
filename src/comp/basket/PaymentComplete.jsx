import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createInvoice } from "../../utils/createInvoice";
import { auth } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { calculateTotalPrice, handlePrinting } from "../../utils/BasketUtils";

const PaymentComplete = ({ venueNtable, basketItems, setBasketItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const [computedBasket, setcomputedBasket] = useState([]);

  useEffect(() => {
    if (!user) return navigate("/");
    setcomputedBasket(basketItems);
    (async () => {
      try {
        if (basketItems.length > 0) {
          setTotal(await calculateTotalPrice(basketItems));

          let data = {
            tableNumber: venueNtable.table,
            venue: venueNtable.venue.id,
            user: { displayName: "Customer-App", email: user.email },
            basketItems,
            basketTotal: parseFloat(total),
            basketDiscount: 0,
            paymentTaken: parseFloat(total),
            paidin: parseFloat(total),
          };

          const query = await createInvoice(data);
          await handlePrinting(data);
          setBasketItems([]);
        }
      } catch (error) {
        alert(error.message);
      }
    })();
  }, []);

  if (user)
    return (
      <div className="grow bg-[--c60] z-10 overflow-y-scroll flex flex-col items-center animate-fadeUP1">
        <div className="mx-auto text-center mt-6 px-4">
          <p className="text-xl">{venueNtable.venue ? venueNtable.venue.name : null}</p>
          <p className="text-xs">{venueNtable.venue ? venueNtable.venue.address : null}</p>
          <p>Table: {venueNtable.table ? venueNtable.table : null}</p>
          <p className="border-b-4 border-b-[--c1]"></p>

          {computedBasket.length > 0 &&
          <>
          <p className="font-bold">
            <span className="capitalize">{user.displayName || user.email}</span>, thank you for your order and payment has been successfull!
          </p>
          <p>Your order has been confirmed!</p>
          <p>{total?.date}</p>
          </>
          }
           {computedBasket.length > 0 &&
          <p className="text-xl pb-4 border-b-2 my-4">Order summary</p>
             }
          <div className="products flex flex-col gap-4 px-4 grow">
            {computedBasket.some((item) => item.subcategory_course === 0) && <span className="border-b-2 border-gray-400">Beverage</span>}
            {computedBasket
              .filter((item) => item.subcategory_course === 0)
              .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
              .map((menuItem, index) => (
                <div key={crypto.randomUUID()} className={` group  item flex flex-col rounded p-2 select-none shadow-md `} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
                  <div className="flex flex-col">
                    <div className={`flex basis-[100%] font-bold`}>
                      <div className="flex flex-col justify-start items-start  basis-[100%] ">
                        <span title={menuItem.name} className={`itemName flex justify-between line-clamp-1 w-[100%]  `}>
                          <span>{menuItem.name}</span>
                          <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {computedBasket.some((item) => item.subcategory_course === 1) && <span className="border-b-2 border-gray-400">Starter</span>}
            {computedBasket
              .filter((item) => item.subcategory_course === 1)
              .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
              .map((menuItem, index) => (
                <div key={crypto.randomUUID()} className={` group  item flex flex-col rounded p-2 select-none shadow-md `} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
                  <div className="flex flex-col">
                    <div className={`flex basis-[100%] font-bold`}>
                      <div className="flex flex-col justify-start items-start  basis-[100%] ">
                        <span title={menuItem.name} className={`itemName flex justify-between line-clamp-1 w-[100%]  `}>
                          <span>{menuItem.name}</span>
                          <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {computedBasket.some((item) => item.subcategory_course === 2) && <span className="border-b-2 border-gray-400">Main</span>}
            {computedBasket
              .filter((item) => item.subcategory_course === 2)
              .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
              .map((menuItem, index) => (
                <div key={crypto.randomUUID()} className={` group  item flex flex-col rounded p-2 select-none shadow-md `} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
                  <div className="flex flex-col">
                    <div className={`flex basis-[100%] font-bold`}>
                      <div className="flex flex-col justify-start items-start  basis-[100%] ">
                        <span title={menuItem.name} className={`itemName flex justify-between line-clamp-1 w-[100%]  `}>
                          <span>{menuItem.name}</span>
                          <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {computedBasket.some((item) => item.subcategory_course === 3) && <span className="border-b-2 border-gray-400">Desert</span>}
            {computedBasket
              .filter((item) => item.subcategory_course === 3)
              .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
              .map((menuItem, index) => (
                <div key={crypto.randomUUID()} className={` group  item flex flex-col rounded p-2 select-none shadow-md `} title={`${menuItem.printed ? "Printed." : "Not printed."}`}>
                  <div className="flex flex-col">
                    <div className={`flex basis-[100%] font-bold`}>
                      <div className="flex flex-col justify-start items-start  basis-[100%] ">
                        <span title={menuItem.name} className={`itemName flex justify-between line-clamp-1 w-[100%]  `}>
                          <span>{menuItem.name}</span>
                          <span>£{(menuItem.price * menuItem.qty).toFixed(2)} </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {computedBasket.length == 0 && <p className="text-center my-10">Basket is empty.</p>}
          </div>
          {computedBasket.length > 0 &&
          <>
          <div className="flex justify-between mt-1">
            <p className="text-xl text-end">VAT: </p>
            {total && <p className="text-end">£{((parseFloat(total) * 20.0) / 100.0).toFixed(2)}</p>}
          </div>
          <div className="flex justify-between mt-1 mb-10 pb-10">
            <p className="text-xl text-end">Total: </p>
            {total && <p className="text-xl font-bold text-end">£{total}</p>}
          </div>
          </>
          }
        </div>
      </div>
    );
};

export default PaymentComplete;
