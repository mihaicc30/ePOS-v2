// https://www.npmjs.com/package/@stripe/react-stripe-js
import React, { useState, useEffect } from "react";
import "./Basket.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { AiOutlineLeft, AiFillExclamationCircle } from "react-icons/ai";
import { auth } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";


import ReactDOM from "react-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
const loader = "auto";
const appearance = {
  theme: "flat",
};
const stripePromise = loadStripe(import.meta.env.VITE_S_PK);

const Payment = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, []);

  const location = useLocation();
  const data = location.state?.totalPrice;
  const computedBasket = location.state?.computedBasket;

  const options = {
    mode: "payment",
    currency: "gbp",
    amount: 1099,
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  };

  const [processing, setProcessing] = useState(false);

  const handleCancel = () => {
    setProcessing(false);
    navigate(-1);
  };

  return (
    <div className="absolute inset-0 bg-[--c60] z-10 overflow-y-scroll flex flex-col">
      <div className="flex items-end">
        <button className="p-2 text-3xl" onClick={handleCancel}>
          <AiOutlineLeft />
        </button>
        <p onClick={handleCancel} className="p-2 text-3xl cursor-pointer">
          Cancel
        </p>
      </div>

      {processing && (
        <div className="mx-auto  animate-fadeUP1 flex flex-col">
          <div className="ui-loader loader-blk mt-8 mx-auto">
            <svg viewBox="22 22 44 44" className="multiColor-loader">
              <circle
                cx="44"
                cy="44"
                r="20.2"
                fill="none"
                strokeWidth="3.6"
                className="loader-circle loader-circle-animation"
              ></circle>
            </svg>
          </div>
          <p className="mt-8 text-xl  mx-auto">Processing...</p>
        </div>
      )}
      <div className="mx-4">
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm data={data} computedBasket={computedBasket} />
        </Elements>
      </div>
    </div>
  );
};

const CheckoutForm = ({ data, computedBasket }) => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsLoading(false);
      return;
    }

    // to validate cart ****************

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setIsLoading(false);
      setMessage(submitError.message);
      return;
    }

    // Create the SetupIntent and obtain clientSecret
    let api = `${import.meta.env.VITE_API}stripe/create-payment-intent2`;
    try {
      const res = await fetch(api, {
        method: "POST",
        headers: {
          
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          amount: data,
          v: import.meta.env.VITE_G,
        }),
      });

      if (res.status == 403) {
        setIsLoading(false);
        setMessage("Request denied.");
        return;
      }
      const { clientSecret: clientSecret } = await res.json();
      // Use the clientSecret and Elements instance to confirm the setup
      const { errror } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/PaymentComplete`,
        },
        // Uncomment below if you only want redirect for redirect-based payments
        redirect: "if_required",
      });

      setIsLoading(false);
      if (errror) {
        if (
          errror.type === "card_error" ||
          errror.type === "validation_error"
        ) {
          setIsLoading(false);
          setMessage(errror.message);
        } else {
          setIsLoading(false);
          setMessage("An unexpected error occured.");
        }
      } else {
        const dataz = {
          totalPrice: data,
          date: new Date().toLocaleString(),
          computedBasket,
        };
        navigate("/PaymentComplete", { state: dataz });
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
      setMessage("Request denied.");
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="CheckoutForm flex flex-col mt-10">
      {message && (
        <div
          id="payment-message"
          className="animate-fadeUP1 border-2 border-[--clwar] bg-[--c30] flex justify-between p-4 my-4"
        >
          <p className="flex">
            <AiFillExclamationCircle className="m-0 mr-1 fill-[--clwar] text-2xl" />
            {message}
          </p>
          <button onClick={() => setMessage("")}>✖</button>
        </div>
      )}
      <PaymentElement
        mode={"setup"}
        stripePromise={stripePromise}
        options={{ appearance, loader }}
      />

      {isLoading ? null : (
        <button
          type="submit"
          disabled={!stripe || !elements || isLoading}
          id="submit"
          style={{ animationDelay: "2s" }}
          className="animate-fadeUP1 opacity-0 mx-auto px-6 bg-[--c1] rounded py-1 my-6 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none"
        >
          Pay £{data}
        </button>
      )}

      {isLoading ? (
        <>
          <div className="ui-loader loader-blk mx-auto animate-fadeUP1 mt-10 pt-10">
            <svg viewBox="22 22 44 44" className="multiColor-loader">
              <circle
                cx="44"
                cy="44"
                r="20.2"
                fill="none"
                strokeWidth="3.6"
                className="loader-circle loader-circle-animation"
              ></circle>
            </svg>
          </div>
          <p className="mt-8 text-xl mx-auto animate-fadeUP1 py-4">
            Processing...
          </p>
        </>
      ) : null}

      <div className="p-4 m-4 border-4 shadow-md shadow-[--clwar]">
        <p className="font-bold text-xl whitespace-nowrap inline-flex gap-4">
          <AiFillExclamationCircle className="fill-[--clwar]" /> Note:
        </p>
        <p>
          For <span className="underline">testing purposes</span>, Stripe is in
          Test Mode. To fully explore and utilize the app's complete
          functionality, you can use the following card details:
        </p>
        <ul className="text-lg font-bold">
          <li>Card Number: 4242 4242 4242 4242</li>
          <li>Expiry: 04/24</li>
          <li>CVC: 242</li>
          <li>Postal Code: 2424</li>
        </ul>
        <p>
          Please note that these are <span className="font-bold">dummy</span>
          card details provided by Stripe for testing purposes. They are
          <span className="font-bold">not</span> associated with any real
          payment method or account!
        </p>
      </div>
    </form>
  );
};

export default Payment;
