import React, { useEffect } from "react";

import { AiOutlineLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

const Faq = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
  }, []);
  return (
    <div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll p-4 flex flex-col gap-4">
      <button className="mr-auto p-2 text-3xl" onClick={() => navigate(-1)}>
        <AiOutlineLeft />
      </button>
      <div className="flex flex-col justify-center items-center">
        <p>Can not find what you are looking for?</p>
        <p> Drop us a message </p>
        <button
          onClick={() => navigate("/Contact")}
          className="bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none"
        >
          Contact us
        </button>
      </div>

      <details className="pb-4 border-b-2">
        <summary>How can I add items to my order?</summary>
        <p>
          To add items to your order, simply browse through the available menu
          items and click on the "+" button to increase the quantity of the
          desired item. You can also select the course number for each item if
          applicable. The selected items will be displayed in the order summary
          section along with the total price.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>Can I customize the ingredients in a menu item?</summary>
        <p>
          Currently, we do not offer customization options for menu items.
          However, if you have specific dietary restrictions or allergies,
          please inform our staff, and we will do our best to accommodate your
          needs.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>Is there a minimum order requirement?</summary>
        <p>
          There is no minimum order requirement. You are free to order as few or
          as many items as you like.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>What payment methods do you accept?</summary>
        <p>
          We accept various payment methods, including credit cards, debit
          cards, and cash. You can choose your preferred payment method during
          the checkout process.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>Are the menu items suitable for vegetarians?</summary>
        <p>
          Yes, we offer a variety of vegetarian menu items. They are clearly
          marked with a "vegetarian" tag for easy identification.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>Do you offer delivery services?</summary>
        <p>
          Yes, we offer delivery services within a certain radius. Please
          provide your address during the ordering process to check if your
          location is eligible for delivery.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>Can I place an order in advance?</summary>
        <p>
          Yes, we accept advance orders. During the ordering process, you can
          select a desired date and time for delivery or pickup. Please note
          that availability may vary based on our business hours.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>What are the allergen options for menu items?</summary>
        <p>
          Allergen information is provided for each menu item. Common allergens
          such as nuts, gluten, and dairy are listed. If you have specific
          allergies or dietary concerns, please review the item's ingredients
          before placing your order.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>Can I cancel or modify my order?</summary>
        <p>
          Once an order has been placed, it may not be possible to cancel or
          modify it. However, please contact our customer support as soon as
          possible, and we will assist you based on the order status and
          circumstances.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>Are there any discounts or promotions available?</summary>
        <p>
          We occasionally offer discounts and promotions. Stay updated by
          subscribing to our newsletter or following our social media accounts
          to receive notifications about ongoing offers and special deals.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>What is the shelf life of the delivered food?</summary>
        <p>
          Our delivered food is freshly prepared and packaged to ensure quality
          and taste. We recommend consuming the food within the designated time
          frame mentioned on the packaging to enjoy it at its best.
        </p>
      </details>
      <details className="pb-4 border-b-2">
        <summary>Can I request a specific delivery time?</summary>
        <p>
          While we strive to deliver orders in a timely manner, we cannot
          guarantee specific delivery times due to various factors such as order
          volume and traffic conditions. However, you can provide a preferred
          delivery time during the checkout process, and we will do our best to
          accommodate it.
        </p>
      </details>
    </div>
  );
};

export default Faq;
