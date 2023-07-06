import React, { useState, useEffect } from "react";
import "./Payment.css";
import { AiOutlineLoading3Quarters, AiOutlineLeft, AiFillExclamationCircle } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, PaymentElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
const loader = "auto";
const appearance = {
  theme: "flat",
};
const stripePromise = loadStripe(import.meta.env.VITE_S_PK);

const options = {
  mode: "payment",
  currency: "gbp",
  amount: 1099,
  layout: {
    type: "tabs",
    defaultCollapsed: false,
  },
};

const Payment = ({ user, basketItems, setBasketItems, venueNtable, setVenueNtable }) => {
  return (
    <div>
      
    </div>
  )
}

export default Payment
