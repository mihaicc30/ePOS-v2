import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Outlet, NavLink, BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Routes
import Layout from "./Layout";

import Menu from "./comp/menu/Menu";
import Auth from "./comp/auth/Auth";
import Signout from "./comp/signout/Signout";
import Basket from "./comp/basket/Basket";
import OrderComplete from "./comp/basket/OrderComplete";
import Page404 from "./comp/Page404";
import Settings from "./comp/Settings/Settings";
import Contact from "./comp/Settings/Contact";
import Notifications from "./comp/Settings/Notifications";
import News from "./comp/Settings/News";
import Privacy from "./comp/Settings/Privacy";
import Symbol from "./comp/Settings/Symbol";
import TC from "./comp/Settings/T&C";
import Tables from "./comp/tables/Tables";

import { getVenueById } from "./utils/BasketUtils";

import { loadStripe } from "@stripe/stripe-js";
import { fetchWeeklyWeather, getTableLayout, getVenues, getMenu, fetchHoliday } from "./utils/DataTools";

const App = () => {
  //app settings
  const [lefty, setLefty] = useState(false);

  const [weeklyWeather, setWeeklyWeather] = useState(false);
  const [user, setUser] = useState(null);
  const [basketItems, setBasketItems] = useState([]);
  const [venueNtable, setVenueNtable] = useState({ venue: 101010, table: null });
  const [weeklyholiday, setWeeklyHoliday] = useState(false);

  const [tables, setTables] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [showArea, setshowArea] = useState("Bar");
  const [uniqueAreas, setuniqueAreas] = useState([]);

  const [menuitems, setMenuitems] = useState([]);
  const [venues, setVenues] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [basketQty, setBasketQty] = useState(0);
  const [basketDiscount, setBasketDiscount] = useState(0);

  const [weeklyForecast, setWeeklyForecast] = useState({
    0: {
      date: `${String(new Date().toLocaleDateString("en-GB")).split("/")[2]}-${String(new Date().toLocaleDateString("en-GB")).split("/")[1]}-${String(new Date().toLocaleDateString("en-GB")).split("/")[0]}`,
    },
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });

  useEffect(() => {
    localStorage.setItem("venueID", 101010);
    async function getAsyncData() {
      setMenuitems(await getMenu());
      setVenues(await getVenues());
      setTables(await getTableLayout()); // table layout
    }
    getAsyncData();
  }, []);

  useEffect(() => {
    if (!tables || tables.length < 1) return;
    setuniqueAreas([...new Set(tables.gridSize.map((table) => table[0]))]);
  }, [tables]);

  useEffect(() => {
    calculateTotalQuantity();
  }, [basketItems]);

  const calculateTotalQuantity = () => {
    const totalQty = basketItems.reduce((total, item) => total + parseInt(item.qty), 0);
    setBasketQty(totalQty);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout weeklyholiday={weeklyholiday} weeklyForecast={weeklyForecast} weeklyWeather={weeklyWeather} setWeeklyWeather={setWeeklyWeather} setWeeklyForecast={setWeeklyForecast} lefty={lefty} setLefty={setLefty} />}>
        <Route path="/" element={<Auth />} />

        <Route path="/tables" element={<Tables setBasketDiscount={setBasketDiscount} basketItems={basketItems} setBasketItems={setBasketItems} tables={tables} setTables={setTables} draggingIndex={draggingIndex} setDraggingIndex={setDraggingIndex} showArea={showArea} setshowArea={setshowArea} uniqueAreas={uniqueAreas} setuniqueAreas={setuniqueAreas} venues={venues} venueNtable={venueNtable} setVenueNtable={setVenueNtable} />} />

        <Route path="/menu" element={<Menu showArea={showArea} setshowArea={setshowArea} uniqueAreas={uniqueAreas} setuniqueAreas={setuniqueAreas} setTables={setTables} tables={tables} lefty={lefty} draggingIndex={draggingIndex} setDraggingIndex={setDraggingIndex} basketDiscount={basketDiscount} setBasketDiscount={setBasketDiscount} basketItems={basketItems} setBasketItems={setBasketItems} menuitems={menuitems} searchValue={searchValue} setSearchValue={setSearchValue} venueNtable={venueNtable} setVenueNtable={setVenueNtable} venues={venues} />}></Route>

        <Route path="/settings" element={<Settings venues={venues} />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/news" element={<News />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/symbol" element={<Symbol />} />
        <Route path="/t&c" element={<TC />} />

        <Route path="/signout" element={<Signout setUser={setUser} setVenueNtable={setVenueNtable} venueNtable={venueNtable} />} />

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default App;
