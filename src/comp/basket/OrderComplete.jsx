import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {getUser} from "../../utils/authUser"


const PaymentComplete = ({ venueNtable, basketItems, computedBasket, setBasketItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState(null);
  const [user,setUser] = useState(null)

  useEffect(() => {
    console.log(basketItems);
    if(localStorage.getItem("order")){
      getUser(setUser)
      setTotal(location.state);
      setBasketItems([]);
      console.log("** development // to post order to the server to be processed **");
      localStorage.removeItem("order")
    }
  }, []);

  return (
    <div className="grow bg-[--c60] z-10 overflow-y-scroll flex flex-col items-center animate-fadeUP1">
      <div className="mx-auto text-center mt-6 px-4">
        <p className="text-xl">{venueNtable.venue ? venueNtable.venue.name : null}</p>
        <p className="text-xs">{venueNtable.venue ? venueNtable.venue.address : null}</p>
        <p>Table: {venueNtable.table ? venueNtable.table : null}</p>
        <p className="border-b-4 border-b-[--c1]"></p>

        <p className="font-bold">
        Thank you <span className="capitalize">{user?.displayName}</span>, your order has been put through!
        </p>
        <p>Your order is now processing!</p>
        <p>{total?.date}</p>

        <p className="text-xl pb-4 border-b-2 my-4">Order summary</p>
        {total &&
          total.computedBasket
            .sort((a, b) => parseInt(a.course) - parseInt(b.course))
            .map((item, index) => {
              return (
                <div key={crypto.randomUUID()} className="product flex gap-2 pb-2 border-b-2 items-center">
                  <img src={item.img} alt={item.name} className="h-[50px] w-[50px]" />
                  <div className="grow flex flex-col justify-start" key={crypto.randomUUID()}>
                    <p className="text-start font-bold text-xl line-clamp-2">
                      {item.qty} x {item.name}
                    </p>
                  </div>
                  <div key={crypto.randomUUID()}>
                    <p className="text-xl text-end">Total:</p>
                    <p className="font-bold text-xl text-end">£{(parseFloat(item.price) * parseFloat(item.qty)).toFixed(2)}</p>
                  </div>
                </div>
              );
              return null; // or handle the case when the condition is not met
            })}

        <div className="flex justify-between mt-1">
          <p className="text-xl text-end">VAT: </p>
          {total && <p className="text-end">£{((parseFloat(total.totalPrice) * 20.0) / 100.0).toFixed(2)}</p>}
        </div>
        <div className="flex justify-between mt-1 mb-10 pb-10">
          <p className="text-xl text-end">Total: </p>
          {total && <p className="text-xl font-bold text-end">£{total.totalPrice}</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentComplete;
