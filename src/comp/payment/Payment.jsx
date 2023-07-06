import React, { useState, useEffect } from "react";
import "./Payment.css";

import { BiSolidMessageError } from "react-icons/bi";
import { SiContactlesspayment } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
import { BsFillCheckCircleFill } from "react-icons/bs";

import { AiOutlineLoading3Quarters, AiOutlineLeft, AiFillExclamationCircle } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, PaymentElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
const loader = "auto";
const appearance = {
  theme: "flat",
};
const stripePromise = loadStripe(import.meta.env.VITE_S_PK);

const Payment = ({ user, basketItems, setBasketItems, venueNtable, setVenueNtable }) => {
  let timer;
  const nav = useNavigate();
  const [computedBasket, setComputedBasket] = useState([]);
  const [computedBasketTotal, setComputedBasketTotal] = useState(0);
  const [basketTotal, setBasketTotal] = useState(0);
  const [paymentTaken, setpaymentTaken] = useState(0);
  const [paymentType, setPaymentType] = useState(null);
  const [stripeResponse, setStripeResponse] = useState("");

  useEffect(() => {
    if (venueNtable.table === "" || !venueNtable.table) return nav("/Tables");
    if (basketItems.length < 1) return nav("/Menu");
  }, [venueNtable]);

  useEffect(() => {
    setComputedBasketTotal(
      computedBasket
        .reduce((total, item) => {
          return total + item.price * item.qty;
        }, 0)
        .toFixed(2)
    );
    setBasketTotal(
      basketItems
        .reduce((total, item) => {
          return total + item.price * item.qty;
        }, 0)
        .toFixed(2)
    );
  }, [computedBasket]);

  useEffect(() => {
    setComputedBasket(basketItems);
  }, [basketItems]);

  const handlePaymentType = async (type) => {
    //to handle later type of payment
    if (type === "cash") {
      let payingAmount = padInput;
      let payIntoBill = (parseFloat(paymentTaken) + parseFloat(payingAmount)).toFixed(2);
      setpaymentTaken(payIntoBill);
      let leftToPay = (parseFloat(basketTotal) - parseFloat(payIntoBill)).toFixed(2)
      setStripeResponse(`Payment successful! £${padInput} has been paid. ${leftToPay > 0 ? `£${leftToPay} are left to pay .` : ``}`);
      clearTimeout(timer)
      timer = setTimeout(() => {
        setStripeResponse(``);
      }, 4000);

    } else if (type === "card") {
      await stripePayment();
    }
  };

  const [padInput, setPadInput] = useState(0);
  const handlePadInput = (e) => {
    if (parseFloat(basketTotal) < parseFloat(paymentTaken)) {
      setPadInput(0);
      return;
    }
    const input = e.target.name;

    if (padInput === 0 && input !== "b" && input !== ".") {
      setPadInput(input);
      return;
    }

    if (String(padInput)?.includes(".") && padInput.split(".")[1].length > 1 && input !== "b") {
      return;
    }

    if (input === "b" && typeof padInput === "string") {
      setPadInput(padInput.slice(0, -1));
      return;
    }

    if (input === "." && !String(padInput).includes(".")) {
      if (padInput.length < 1 || String(padInput) === "") {
        setPadInput(padInput + "0" + input);
      } else {
        setPadInput(padInput + input);
      }
      return;
    }

    if (parseInt(input) >= 0) {
      setPadInput(padInput + input);
      return;
    }
  };

  const DCOPB = () => {
    // disable condition of payment button
    // stripe minimum payment £0.3 !
    if (padInput.length < 1 ||
       parseFloat(padInput) <= 0.30 ||
        padInput === 0 || padInput === "0" ||
         padInput == "0.0" || padInput == "0." || padInput == "0.00" ||
          padInput.endsWith(".") || (padInput[0] === "0" && !padInput[1] === ".") 
          || parseFloat(basketTotal) < parseFloat(paymentTaken)) {
      return true;
    }
    return false;
  };

  const calculateAmountToPay = () => {
    const paymentTakenFloat = parseFloat(paymentTaken);
    const basketTotalFloat = parseFloat(basketTotal);

    if (basketTotalFloat > 0)
      if (paymentTakenFloat > basketTotalFloat) {
        return `Payment complete. Change £${(paymentTakenFloat - basketTotalFloat).toFixed(2)}`;
      } else if (paymentTakenFloat === basketTotalFloat) {
        return `Payment complete. No Change.`;
      } else {
        return `£${(basketTotalFloat - paymentTakenFloat).toFixed(2)}`;
      }
  };

  const stripePayment = async () => {
    const stripe = Stripe(import.meta.env.VITE_S_PK);

    const api = `${import.meta.env.VITE_API}stripe/create-payment-intent3`;

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          v: import.meta.env.VITE_G,
          amount: padInput,
        }),
      });

      if (res.status === 403) {
        setStripeResponse(`Failure to fetch. Request Denied based on app credentials.`);
        clearTimeout(timer)
        timer = setTimeout(() => {
          setStripeResponse(``);
        }, 4000);
        return;
      }

      const cs = await res.json();
      console.log(cs.clientSecret);
      // Confirm the PaymentIntent
      const stripeConfirmPayment = await stripe.confirmPayment({
        clientSecret: cs.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/Payment?stripe=sucessfull`,
        },
        // Uncomment below if you only want redirect for redirect-based payments
        redirect: "if_required",
      });

      if (stripeConfirmPayment.error) {
        console.log(stripeConfirmPayment.error);
        if (error.type === "card_error" || error.type === "validation_error") {
          alert(error.message);
          setStripeResponse(error.message);
          clearTimeout(timer)
          timer = setTimeout(() => {
            setStripeResponse(``);
          }, 4000);
        } else {
          setStripeResponse("An unexpected error occured.");
          clearTimeout(timer)
          timer = setTimeout(() => {
            setStripeResponse(``);
          }, 4000);
        }
      } else if (stripeConfirmPayment.paymentIntent) {
        console.log(stripeConfirmPayment.paymentIntent);
        
        let payingAmount = padInput;
        let payIntoBill = (parseFloat(paymentTaken) + parseFloat(payingAmount)).toFixed(2);
        setpaymentTaken(payIntoBill);
        
        let leftToPay = (parseFloat(basketTotal) - parseFloat(payIntoBill)).toFixed(2)
        setStripeResponse(`Payment successful! £${padInput} has been paid. ${leftToPay > 0 ? `£${leftToPay} are left to pay .` : ``}`);
        clearTimeout(timer)
        timer = setTimeout(() => {
          setStripeResponse(``);
        }, 4000);
      }
    } catch (error) {
      setStripeResponse(error.message);
      clearTimeout(timer)
      timer = setTimeout(() => {
        setStripeResponse(``);
      }, 4000);
    }
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 h-[100%] w-[100%]">
      {parseFloat(basketTotal) > parseFloat(paymentTaken) && (
        <button className="absolute top-0 left-0 p-4 text-5xl animate-fadeUP1" onClick={() => nav("/Menu")}>
          ◀ Cancel
        </button>
      )}
      <span></span>
      <div className={`flex flex-col justify-center items-center ${parseFloat(basketTotal) > parseFloat(paymentTaken) ? "" : "row-span-2"} `}>
      {parseFloat(basketTotal) > parseFloat(paymentTaken) && <p className="animate-fadeUP1 text-xs" title="Stripe's minimum payment is £0.30.">Minimum pay: £0.30!</p>}
        <p className="animate-fadeUP1 mb-2 border-b-2 pb-2  text-3xl">Payment</p>
        {parseFloat(basketTotal) > parseFloat(paymentTaken) && <p className="animate-fadeUP1 text-sm">Left to pay:</p>}
        <p className="animate-fadeUP1 font-bold text-center text-xl">{calculateAmountToPay()}</p>
        {parseFloat(basketTotal) < parseFloat(paymentTaken) && (
          <div className="flex flex-col gap-4 text-center">
            <p className="mt-8">Do you need a receipt?</p>
            <button
              onClick={() => {
                console.log("Print receipt and return to the table screen.");
                setVenueNtable((prevValues) => ({ ...prevValues, table: null }));
                nav("/Tables");
              }}
              className="bg-[--c1] p-2 rounded-lg font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
              Print Receipt
            </button>
            <p>-or-</p>
            <button
              onClick={() => {
                console.log("Return to the table screen.");
                setVenueNtable((prevValues) => ({ ...prevValues, table: null }));
                nav("/Tables");
              }}
              className="bg-[--c1] p-2 rounded-lg font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
              Done
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2">
        <button disabled={DCOPB()} onClick={() => handlePaymentType("cash")} className={`text-xl m-2 px-6 py-4 border-b-2 border-b-black relative basis-[20%] transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center justify-center font-semibold ${DCOPB() ? "bg-gray-300 text-gray-400" : "bg-[--c1]"} `}>
          Confirm {padInput.length !== 0 && parseFloat(basketTotal) > parseFloat(paymentTaken) ? "£" : ""}
          {parseFloat(basketTotal) > parseFloat(paymentTaken) ? padInput : ""} Payment Taken with Cash <GiTakeMyMoney className="text-5xl mx-auto" />
        </button>
        <button disabled={DCOPB()} onClick={() => handlePaymentType("card")} className={`text-xl m-2 px-6 py-4 border-b-2 border-b-black relative basis-[20%] transition-all cursor-pointer hover:scale-[0.98] active:scale-[0.90] rounded-xl flex flex-col text-center justify-center font-semibold ${DCOPB() ? "bg-gray-300 text-gray-400" : "bg-[--c1]"} `}>
          Confirm {padInput.length !== 0 && parseFloat(basketTotal) > parseFloat(paymentTaken) ? "£" : ""}
          {parseFloat(basketTotal) > parseFloat(paymentTaken) ? padInput : ""} Payment Taken with Card <SiContactlesspayment className="text-[4rem] stroke-[0.1px] mx-auto" />
        </button>
      </div>
      <span></span> {/* placeholder for future development */}
      <div className={`${parseFloat(basketTotal) > parseFloat(paymentTaken) ? "" : "hidden"}`}>
        {parseFloat(basketTotal) > parseFloat(paymentTaken) && <AiOutlineLoading3Quarters className="animate-spin mx-auto text-5xl" />}
        {parseFloat(basketTotal) > parseFloat(paymentTaken) && <p className="text-center text-sm my-4">Awaiting Payment...</p>}
      </div>
      <div className="keypad grid grid-cols-3 grid-rows-5 gap-4 my-4 animate-fadeUP1 row-span-2">
        <p className="col-span-2 bg-white px-2 py-6 text-center my-auto text-xl h-[76px]">
          {parseFloat(basketTotal) > parseFloat(paymentTaken) && padInput.length !== 0 ? "£" : ""}
          {parseFloat(basketTotal) < parseFloat(paymentTaken) ? "" : padInput}
        </p>
        <button name="b" onClick={handlePadInput} className="bg-[--c3] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          ◀
        </button>
        <button name="1" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          1
        </button>
        <button name="2" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          2
        </button>
        <button name="3" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          3
        </button>
        <button name="4" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          4
        </button>
        <button name="5" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          5
        </button>
        <button name="6" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          6
        </button>
        <button name="7" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          7
        </button>
        <button name="8" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          8
        </button>
        <button name="9" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          9
        </button>
        <button name="0" onClick={handlePadInput} className="bg-[--c1] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          0
        </button>
        <button name="." onClick={handlePadInput} className="bg-[--c3] rounded font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
          .
        </button>
      </div>
      <span></span>
      {stripeResponse !== "" && (
        <div className="text-center text-xl animate-fadeUPnDOWN transition">
          {stripeResponse.startsWith("Fail") ? <BiSolidMessageError className="mx-auto text-5xl fill-red-400" /> : <BsFillCheckCircleFill className="mx-auto text-5xl fill-green-400" />}
          <p>{stripeResponse}</p>
          <span className={`block mx-auto my-4 ${stripeResponse.startsWith("Fail") ? "bg-red-400" : "bg-green-400"} w-[90%] h-1 rounded-xl animate-shrinkFromLeft`}></span>
          {stripeResponse.startsWith("Fail") ? "If you are a developer or a tester, you probably forgot to start the development server or the correct env." : ""}
        </div>
      )}
    </div>
  );
};

export default Payment;
