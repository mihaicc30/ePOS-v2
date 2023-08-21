import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, db, logout } from "./firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

import { Routes, Route, Outlet, NavLink, BrowserRouter } from "react-router-dom";

// Routes
import Layout from "./Layout";

import MenuItem from "./comp/menu/MenuItem";
import MenuItemDetails from "./comp/menu/MenuItemDetails";
import Menu from "./comp/menu/Menu";
import Auth from "./comp/auth/Auth";
import Receipts from "./comp/Receipts/Receipts";
import Signout from "./comp/signout/Signout";
import Basket from "./comp/basket/Basket";
import Payment from "./comp/basket/Payment";
import PaymentComplete from "./comp/basket/PaymentComplete";
import Page404 from "./comp/Page404";
import Settings from "./comp/Settings/Settings";
import Contact from "./comp/Settings/Contact";
import FAQ from "./comp/Settings/Faq";
import Notifications from "./comp/Settings/Notifications";
import News from "./comp/Settings/News";
import Privacy from "./comp/Settings/Privacy";
import Symbol from "./comp/Settings/Symbol";
import TC from "./comp/Settings/T&C";

import { getVenueById } from "./utils/BasketUtils";
import { grabProducts } from "./utils/grabProducts";

import { loadStripe } from "@stripe/stripe-js";

const App = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [venues, setVenues] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [venueNtable, setVenueNtable] = useState({ venue: null, table: null });
  const [menuitems, setMenuitems] = useState([]);
  const [selectedKCal, setSelectedKCal] = useState("clear");
  const [selectedDietary, setSelectedDietary] = useState("clear");
  const [toggleGrid, setToggleGrid] = useState(false);
  const [toggleFilters, setToggleFilters] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [basketQty, setBasketQty] = useState(0);

  const [basketItems, setBasketItems] = useState([]);

  const calculateTotalQuantity = () => {
    const totalQty = basketItems.reduce((total, item) => total + parseInt(item.qty), 0);
    setBasketQty(totalQty);
  };

  useEffect(() => {
    // if (loading) return;
    (async () => {
      setVenues(await getVenues());
      setMenuitems(await grabProducts());
    })();
  }, [user]);

  useEffect(()=>{
    console.log(menuitems);
  },[menuitems])

  useEffect(() => {
    calculateTotalQuantity();
  }, [basketItems]);

  return (
    <Routes>
      <Route path="/" element={<Layout basketQty={basketQty} />}>
        <Route path="/" element={<Auth />} />
        <Route path="/menu" element={<Menu basketItems={basketItems} setBasketItems={setBasketItems} menuitems={menuitems} toggleGrid={toggleGrid} setToggleGrid={setToggleGrid} toggleFilters={toggleFilters} setToggleFilters={setToggleFilters} searchValue={searchValue} setSearchValue={setSearchValue} selectedKCal={selectedKCal} setSelectedKCal={setSelectedKCal} selectedDietary={selectedDietary} setSelectedDietary={setSelectedDietary} venueNtable={venueNtable} setVenueNtable={setVenueNtable} venues={venues} />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route
          path="/basket"
          element={
            <Basket
              menuitems={menuitems}
              basketItems={basketItems}
              setBasketItems={setBasketItems}
              venueNtable={{
                venue: getVenueById(venues, venueNtable.venue),
                table: venueNtable.table,
              }}
              setVenueNtable={setVenueNtable}
            />
          }
        />
        <Route path="/payment" element={<Payment basketQty={basketQty} />} />
        <Route path="/paymentcomplete" element={<PaymentComplete venueNtable={{ venue: getVenueById(venues, venueNtable.venue), table: venueNtable.table }} menuitems={menuitems} venues={venues} basketItems={basketItems} setBasketItems={setBasketItems} />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/news" element={<News />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/symbol" element={<Symbol />} />
        <Route path="/t&c" element={<TC />} />

        <Route path="/signout" element={<Signout setVenueNtable={setVenueNtable} />} />

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default App;

const getVenues = async () => {
  try {
    const query = await fetch(`${import.meta.env.VITE_API}grabVenues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        v: import.meta.env.VITE_G,
      }),
    });
    const response = await query.json();
    console.log("Receied venue data.", new Date().toUTCString());
    return response;
  } catch (error) {
    console.log(error.message);
  }
};
