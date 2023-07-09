import React, { useState, useEffect, Suspense } from "react";
import "./Payment.css";
import { calculateTotal, calculateBasketQTY } from "../../utils/BasketUtils";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Payment = ({ basketDiscount, user, basketItems, setBasketItems, venueNtable, setVenueNtable }) => {
  const [isCardPressed, setIsCardPressed] = useState(false);
  const [isCashPressed, setIsCashPressed] = useState(false);
  const [showCardSwipe, setshowCardSwipe] = useState(false);

  const nav = useNavigate();
  const [computedBasket, setComputedBasket] = useState([]);
  const [computedBasketTotal, setComputedBasketTotal] = useState(0);
  const [change, setChange] = useState(0.0);
  const [basketTotal, setBasketTotal] = useState(0);
  const [paymentTaken, setpaymentTaken] = useState(0);
  const [paymentType, setPaymentType] = useState(null);

  useEffect(() => {
    if (venueNtable.table === "" || !venueNtable.table) return nav("/Tables");
    if (basketItems.length < 1) return nav("/Menu");
  }, [venueNtable]);

  useEffect(() => {
    setComputedBasketTotal(calculateTotal(basketItems, basketDiscount));
    setBasketTotal(calculateTotal(basketItems, basketDiscount));
  }, [computedBasket]);

  useEffect(() => {
    setComputedBasket(basketItems);
  }, [basketItems]);

  const handlePaymentType = async (type) => {
    if (type === "cash") {
      setIsCashPressed(true);
      let payingAmount = padInput;
      let payIntoBill = (parseFloat(paymentTaken) + parseFloat(payingAmount)).toFixed(2);
      setpaymentTaken(payIntoBill);
      let leftToPay = (parseFloat(basketTotal) - parseFloat(payIntoBill)).toFixed(2);
      let change = -(parseFloat(basketTotal) - parseFloat(payIntoBill)).toFixed(2);
      setChange(change);
      toast.success(`Payment successful! £${padInput} has been paid. ${leftToPay > 0 ? `£${leftToPay} are left to pay .` : ``}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      if (leftToPay <= 0) {
        console.log("Basked is Paid. Clearing the basket.");
        setBasketItems([]);
      }
      setTimeout(() => {
        setIsCashPressed(false);
      }, 1000);
    } else if (type === "card") {
      setshowCardSwipe(!showCardSwipe);
      setIsCardPressed(true);
      try {
        const response = await stripePayment();
        if (!response) {
          setshowCardSwipe(false);
          console.log("paymentIntent", response);
          setIsCardPressed(false);
          toast.error(`Fail! Could not get stripe payment intent.`, {
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
        setshowCardSwipe(false);
        const payingAmount = padInput;
        const payIntoBill = (parseFloat(paymentTaken) + parseFloat(payingAmount)).toFixed(2);
        setpaymentTaken(payIntoBill);
        const leftToPay = (parseFloat(basketTotal) - parseFloat(payIntoBill)).toFixed(2);
        const change = -(parseFloat(basketTotal) - parseFloat(payIntoBill)).toFixed(2);
        setChange(change);
        setIsCardPressed(false);
        toast.success(`Success! Payment of £${padInput} has been made. ${leftToPay > 0 ? `£${leftToPay} are left to pay.` : ``}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        if (leftToPay <= 0) {
          console.log("Basket is paid. Clearing the basket.");
          setBasketItems([]);
        }
        console.log("Payment successful:", response);
      } catch (error) {
        setIsCardPressed(false);
        toast.error(`Payment failed: ${error}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
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
    if (parseFloat(computedBasketTotal) <= parseFloat(paymentTaken) || padInput.length < 1 || isCardPressed || isCashPressed || parseFloat(padInput) <= 0.3 || padInput === 0 || padInput === "0" || padInput == "0.0" || padInput == "0." || padInput == "0.00" || padInput.endsWith(".") || (padInput[0] === "0" && !padInput[1] === ".") || parseFloat(basketTotal) < parseFloat(paymentTaken)) {
      return true;
    }
    return false;
  };

  const calculateAmountToPay = () => {
    const paymentTakenFloat = parseFloat(paymentTaken);
    const computedBasketTotalFloat = parseFloat(computedBasketTotal);
    if (computedBasketTotalFloat >= 0)
      if (paymentTakenFloat > computedBasketTotalFloat) {
        return `Payment complete. Change £${change.toFixed(2)}`;
      } else if (paymentTakenFloat === computedBasketTotalFloat) {
        return `Payment complete. No Change.`;
      } else {
        return `£${(computedBasketTotalFloat - paymentTakenFloat).toFixed(2)}`;
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
        toast.error(`Failure to fetch. Request Denied based on app credentials.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        return false;
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
          toast.error("An unexpected error occured.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
          return false;
        } else {
          toast.error("An unexpected error occured.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
          return false;
        }
      } else if (stripeConfirmPayment.paymentIntent) {
        console.log(stripeConfirmPayment.paymentIntent);
        return true;
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return false;
    }
  };
  return (
    <div className="grid grid-cols-3 grid-rows-3 h-[100%] w-[100%]">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      {parseFloat(basketTotal) > parseFloat(paymentTaken) && (
        <button className="absolute top-0 left-0 p-4 text-5xl animate-fadeUP1" onClick={() => nav("/Menu")}>
          ◀ Cancel
        </button>
      )}

      <span></span>
      <div className={`flex flex-col justify-center items-center ${parseFloat(basketTotal) > parseFloat(paymentTaken) ? "" : "row-span-2"} `}>
        {parseFloat(computedBasketTotal) > parseFloat(paymentTaken) && (
          <p className="animate-fadeUP1 text-xs" title="Stripe's minimum payment is £0.30.">
            Minimum pay: £0.30!
          </p>
        )}
        <p className="animate-fadeUP1 mb-2 border-b-2 pb-2  text-3xl">Payment</p>
        {parseFloat(computedBasketTotal) > parseFloat(paymentTaken) && <p className="animate-fadeUP1 text-sm">Left to pay:</p>}
        <p className="animate-fadeUP1 font-bold text-center text-xl">{calculateAmountToPay()}</p>
        {parseFloat(computedBasketTotal) <= parseFloat(paymentTaken) && (
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
          {!showCardSwipe ? (
            <>
              Take {padInput.length !== 0 && parseFloat(basketTotal) > parseFloat(paymentTaken) ? "£" : ""}
              {parseFloat(basketTotal) > parseFloat(paymentTaken) ? padInput : ""} Card Payment
            </>
          ) : (
            <>
              <AiOutlineLoading3Quarters className="animate-spin mx-auto text-5xl" />
            </>
          )}

          <SiContactlesspayment className="text-[4rem] stroke-[0.1px] mx-auto" />
        </button>
      </div>
      <span>
        {showCardSwipe && (
          <div className="">
            <div className="animated-bg-container">
              <div className="background-image"></div>
            </div>
            <div className="icon-container2">
              <div className="icon2">
                <div className="inner-icon2">
                  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 756 858" enableBackground="new 0 0 756 858" xmlSpace="preserve">
                    <path
                      id="bottomslide"
                      fill="#fff"
                      d="M495.8,541.9h-84.5c-1.1,0-2-0.9-2-2V342.5c0-1.1,0.9-2,2-2h84.5c1.1,0,2,0.9,2,2v197.5
               C497.8,541,496.9,541.9,495.8,541.9z"
                    />
                    <g id="card2" v-bind:classname="{'animate':step === 'stepfive'}">
                      <path
                        fill="#E5E5E5"
                        d="M556,123.2v199.9c0,1.1-0.9,2-2,2H430.7c-1.1,0-2-0.9-2-2V123.2c0-1.1,0.9-2,2-2H554
                  C555.1,121.2,556,122.1,556,123.2z"
                      />
                      <rect x="351.2" y="209.5" transform="matrix(6.123234e-17 -1 1 6.123234e-17 230.0159 676.2959)" fill="#303030" width="203.9" height="27.2" />
                      <rect x="430.5" y="213.9" transform="matrix(6.123234e-17 -1 1 6.123234e-17 274.1384 720.4184)" fill="#FFFFFF" width="133.5" height="18.5" />
                      <rect x="484.3" y="171.1" transform="matrix(6.123234e-17 -1 1 6.123234e-17 323.1085 671.4483)" fill="#A0A0A0" width="26" height="6.2" />
                      <rect x="528.8" y="288.5" transform="matrix(6.123234e-17 -1 1 6.123234e-17 250.194 833.3431)" fill="#A0A0A0" width="26" height="6.2" />
                      <rect x="501.6" y="226.7" transform="matrix(6.123234e-17 -1 1 6.123234e-17 311.9859 771.5512)" fill="#A0A0A0" width="80.3" height="6.2" />
                    </g>
                    <g id="machine">
                      <path
                        id="topslide"
                        fill="#f88f2d"
                        d="M483.6,546.2h-84.5c-1.1,0-2-0.9-2-2v-206c0-1.1,0.9-2,2-2h84.5c1.1,0,2,0.9,2,2v206
                  C485.6,545.3,484.7,546.2,483.6,546.2z"
                      />
                      <path
                        fill="#fa8d2883"
                        d="M426.6,794.8h-304c-1.1,0-2-0.9-2-2V316.7c0-1.1,0.9-2,2-2h304c1.1,0,2,0.9,2,2v476.1
                  C428.6,793.9,427.7,794.8,426.6,794.8z"
                      />
                      <path
                        fill="#57412a"
                        d="M422.6,786.2H126c-3.3,0-6-2.7-6-6V271.5c0-3.3,2.7-6,6-6h296.6c3.3,0,6,2.7,6,6v508.8
                  C428.6,783.5,425.9,786.2,422.6,786.2z"
                      />
                      <rect x="120" y="295.5" fill="#fa8d2883" width="308.6" height="495.1" />
                      <rect x="146.8" y="295.5" fill="#f88f2d" width="255" height="499.3" />
                      <rect x="171.4" y="325.5" fill="#F9F9F9" width="205.7" height="158.6" />
                      <g>
                        <g>
                          <path
                            fill="#fff"
                            d="M229.4,537.6H174c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C231.4,536.7,230.5,537.6,229.4,537.6z"
                          />
                          <path
                            fill="#fff"
                            d="M302.6,537.6h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C304.6,536.7,303.7,537.6,302.6,537.6z"
                          />
                          <path
                            fill="#fff"
                            d="M375.8,537.6h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C377.8,536.7,376.9,537.6,375.8,537.6z"
                          />
                        </g>
                        <g>
                          <path
                            fill="#fff"
                            d="M229.4,582.6H174c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C231.4,581.7,230.5,582.6,229.4,582.6z"
                          />
                          <path
                            fill="#fff"
                            d="M302.6,582.6h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C304.6,581.7,303.7,582.6,302.6,582.6z"
                          />
                          <path
                            fill="#fff"
                            d="M375.8,582.6h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C377.8,581.7,376.9,582.6,375.8,582.6z"
                          />
                        </g>
                        <g>
                          <path
                            fill="#fff"
                            d="M229.4,627.6H174c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C231.4,626.7,230.5,627.6,229.4,627.6z"
                          />
                          <path
                            fill="#fff"
                            d="M302.6,627.6h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C304.6,626.7,303.7,627.6,302.6,627.6z"
                          />
                          <path
                            fill="#fff"
                            d="M375.8,627.6h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C377.8,626.7,376.9,627.6,375.8,627.6z"
                          />
                        </g>
                        <g>
                          <path
                            fill="#fff"
                            d="M229.4,672.6H174c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C231.4,671.7,230.5,672.6,229.4,672.6z"
                          />
                          <path
                            fill="#fff"
                            d="M302.6,672.6h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C304.6,671.7,303.7,672.6,302.6,672.6z"
                          />
                          <path
                            fill="#fff"
                            d="M375.8,672.6h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C377.8,671.7,376.9,672.6,375.8,672.6z"
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            fill="#57412a"
                            d="M229.4,531.2H174c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C231.4,530.3,230.5,531.2,229.4,531.2z"
                          />
                          <path
                            fill="#57412a"
                            d="M302.6,531.2h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C304.6,530.3,303.7,531.2,302.6,531.2z"
                          />
                          <path
                            fill="#57412a"
                            d="M375.8,531.2h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C377.8,530.3,376.9,531.2,375.8,531.2z"
                          />
                        </g>
                        <g>
                          <path
                            fill="#57412a"
                            d="M229.4,576.2H174c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C231.4,575.3,230.5,576.2,229.4,576.2z"
                          />
                          <path
                            fill="#57412a"
                            d="M302.6,576.2h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C304.6,575.3,303.7,576.2,302.6,576.2z"
                          />
                          <path
                            fill="#57412a"
                            d="M375.8,576.2h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C377.8,575.3,376.9,576.2,375.8,576.2z"
                          />
                        </g>
                        <g>
                          <path
                            fill="#57412a"
                            d="M229.4,621.2H174c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C231.4,620.3,230.5,621.2,229.4,621.2z"
                          />
                          <path
                            fill="#57412a"
                            d="M302.6,621.2h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C304.6,620.3,303.7,621.2,302.6,621.2z"
                          />
                          <path
                            fill="#57412a"
                            d="M375.8,621.2h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C377.8,620.3,376.9,621.2,375.8,621.2z"
                          />
                        </g>
                        <g>
                          <path
                            fill="#57412a"
                            d="M229.4,666.2H174c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C231.4,665.3,230.5,666.2,229.4,666.2z"
                          />
                          <path
                            fill="#57412a"
                            d="M302.6,666.2h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C304.6,665.3,303.7,666.2,302.6,666.2z"
                          />
                          <path
                            fill="#57412a"
                            d="M375.8,666.2h-55.3c-1.1,0-2-0.9-2-2v-21.7c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v21.7
                        C377.8,665.3,376.9,666.2,375.8,666.2z"
                          />
                        </g>
                      </g>
                      <g>
                        <path
                          fill="#C6C6C6"
                          d="M229.4,743.4H174c-1.1,0-2-0.9-2-2v-28.1c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v28.1
                     C231.4,742.5,230.5,743.4,229.4,743.4z"
                        />
                        <path
                          fill="#C6C6C6"
                          d="M302.6,743.4h-55.3c-1.1,0-2-0.9-2-2v-28.1c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v28.1
                     C304.6,742.5,303.7,743.4,302.6,743.4z"
                        />
                        <path
                          fill="#C6C6C6"
                          d="M375.8,743.4h-55.3c-1.1,0-2-0.9-2-2v-28.1c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v28.1
                     C377.8,742.5,376.9,743.4,375.8,743.4z"
                        />
                      </g>
                      <g>
                        <path
                          fill="#FFFFFF"
                          d="M229.4,736.9H174c-1.1,0-2-0.9-2-2v-28.1c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v28.1
                     C231.4,736,230.5,736.9,229.4,736.9z"
                        />
                        <path
                          fill="#FFFFFF"
                          d="M302.6,736.9h-55.3c-1.1,0-2-0.9-2-2v-28.1c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v28.1
                     C304.6,736,303.7,736.9,302.6,736.9z"
                        />
                        <path
                          fill="#FFFFFF"
                          d="M375.8,736.9h-55.3c-1.1,0-2-0.9-2-2v-28.1c0-1.1,0.9-2,2-2h55.3c1.1,0,2,0.9,2,2v28.1
                     C377.8,736,376.9,736.9,375.8,736.9z"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </span>
      <div className={`${parseFloat(basketTotal) > parseFloat(paymentTaken) ? "" : "hidden"}`}>
        {parseFloat(basketTotal) > parseFloat(paymentTaken) && <AiOutlineLoading3Quarters className="animate-spin mx-auto text-5xl" />}
        {parseFloat(basketTotal) > parseFloat(paymentTaken) && <p className="text-center text-sm my-4">Awaiting Payment...</p>}
      </div>
      <div className="keypad grid grid-cols-3 grid-rows-5 gap-4 my-4 animate-fadeUP1 row-span-2">
        <p className="col-span-2 bg-white px-2 py-6 text-center my-auto text-xl h-[76px]">
          {parseFloat(basketTotal) > parseFloat(paymentTaken) && padInput.length !== 0 ? "£" : ""}
          {parseFloat(computedBasketTotal) <= parseFloat(paymentTaken) ? "" : padInput}
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
    </div>
  );
};

export default Payment;
