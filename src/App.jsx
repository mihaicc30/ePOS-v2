import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, db, logout } from "./firebase/config.jsx";
import { Routes, Route, Outlet, NavLink, BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Routes
import Layout from "./Layout";

import Admin from "./comp/admin/Admin";
import Menu from "./comp/menu/Menu";
import Auth from "./comp/auth/Auth";
import Signout from "./comp/signout/Signout";
import Basket from "./comp/basket/Basket";
import OrderComplete from "./comp/basket/OrderComplete";
import Page404 from "./comp/Page404";
import Settings from "./comp/Settings/Settings";
import Contact from "./comp/Settings/Contact";
import FAQ from "./comp/Settings/Faq";
import Notifications from "./comp/Settings/Notifications";
import News from "./comp/Settings/News";
import Privacy from "./comp/Settings/Privacy";
import Symbol from "./comp/Settings/Symbol";
import TC from "./comp/Settings/T&C";
import Payment from "./comp/payment/Payment";
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
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });

  useEffect(() => {
    async function getAsyncData() {
      setWeeklyHoliday(await fetchHoliday());
      setMenuitems(await getMenu());
      setVenues(await getVenues());
      setWeeklyWeather(await fetchWeeklyWeather());
      setTables(await getTableLayout()); // table layout
      fetchForecastWeek();
    }
    getAsyncData();
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      await fetchForecastWeek();
    }, 1000);
  }, [weeklyWeather]);

  useEffect(() => {
    if (!tables || tables.length < 1) return;
    setuniqueAreas([...new Set(tables.map((table) => table.area))]);
  }, [tables]);

  useEffect(() => {
    calculateTotalQuantity();
  }, [basketItems]);

  const calculateTotalQuantity = () => {
    const totalQty = basketItems.reduce((total, item) => total + parseInt(item.qty), 0);
    setBasketQty(totalQty);
  };

  const fetchForecastWeek = async () => {
    if (!weeklyWeather) return;

    for (let n = 0; n < 7; n++) {
      let dayt = (new Date().getDay() + n) % 7;

      setTimeout(async () => {
        let tempz = {
          cloudy: weeklyWeather.forecast.forecastday[n]?.hour[12].cloud || parseInt(Math.random() * (99 - 1) + 1),
          humidity: weeklyWeather.forecast.forecastday[n]?.hour[12].humidity || parseInt(Math.random() * (99 - 1) + 1),
          windspeed: weeklyWeather.forecast.forecastday[n]?.hour[12].wind_mph || parseInt(Math.random() * (99 - 1) + 1),
          temp: weeklyWeather.forecast.forecastday[n]?.hour[12].temp_c || parseInt(Math.random() * (44 - 1) + 1),
          daytype: dayt,
          isholiday: weeklyholiday[`${n}`]?.title ? 1 : 0,
        };
        // console.log(`calling forecast api with this data:`, tempz);
        try {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + n);
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const day = String(currentDate.getDate()).padStart(2, "0");

          const response = await fetch(`${import.meta.env.VITE_API}forecast-quick`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
              date: currentDate.toLocaleDateString(),
              cloudy: weeklyWeather.forecast.forecastday[n]?.hour[12].cloud || parseInt(Math.random() * (99 - 1) + 1),
              humidity: weeklyWeather.forecast.forecastday[n]?.hour[12].humidity || parseInt(Math.random() * (99 - 1) + 1),
              windspeed: weeklyWeather.forecast.forecastday[n]?.hour[12].wind_mph || parseInt(Math.random() * (99 - 1) + 1),
              temp: weeklyWeather.forecast.forecastday[n]?.hour[12].temp_c || parseInt(Math.random() * (44 - 1) + 1),
              daytype: dayt,
              isholiday: weeklyholiday[`${n}`]?.title ? 1 : 0,
              venueID: localStorage.getItem("venueID"),
              forceRefresh: localStorage.getItem("refreshForecast"),
            }),
          });
          const data = await response.json();

          setWeeklyForecast((prevState) => ({
            ...prevState,
            [n]: { date: `${year}-${month}-${day}`, average: data.average },
          }));
          localStorage.removeItem("refreshForecast");
        } catch (error) {
          localStorage.removeItem("refreshForecast");
          console.error("Error fetching weather:", error);
        }
      }, 500);
    }
  };

  useEffect(() => {
    // for dev

    const handleKeyPress = (event) => {
      if (event.key === "F9") {
        console.log("basketItems", basketItems, basketQty);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout weeklyholiday={weeklyholiday} weeklyForecast={weeklyForecast} weeklyWeather={weeklyWeather} setWeeklyWeather={setWeeklyWeather} setWeeklyForecast={setWeeklyForecast} lefty={lefty} setLefty={setLefty} />}>
        <Route path="/" element={<Auth />} />

        <Route
          path="/admin/*"
          element={<Admin weeklyholiday={weeklyholiday} setWeeklyHoliday={setWeeklyHoliday} weeklyWeather={weeklyWeather} setWeeklyWeather={setWeeklyWeather} weeklyForecast={weeklyForecast} setWeeklyForecast={setWeeklyForecast} menuitems={menuitems} setMenuitems={setMenuitems} tables={tables} setTables={setTables} draggingIndex={draggingIndex} setDraggingIndex={setDraggingIndex} showArea={showArea} setshowArea={setshowArea} uniqueAreas={uniqueAreas} setuniqueAreas={setuniqueAreas} venues={venues} venueNtable={venueNtable} setVenueNtable={setVenueNtable} />}
        />
        <Route path="/tables" element={<Tables setBasketDiscount={setBasketDiscount} basketItems={basketItems} setBasketItems={setBasketItems} tables={tables} setTables={setTables} draggingIndex={draggingIndex} setDraggingIndex={setDraggingIndex} showArea={showArea} setshowArea={setshowArea} uniqueAreas={uniqueAreas} setuniqueAreas={setuniqueAreas} venues={venues} venueNtable={venueNtable} setVenueNtable={setVenueNtable} />} />

        <Route path="/menu" element={<Menu lefty={lefty} basketDiscount={basketDiscount} setBasketDiscount={setBasketDiscount} basketItems={basketItems} setBasketItems={setBasketItems} menuitems={menuitems} searchValue={searchValue} setSearchValue={setSearchValue} venueNtable={venueNtable} setVenueNtable={setVenueNtable} venues={venues} />}></Route>

        <Route path="/payment" element={<Payment lefty={lefty} basketDiscount={basketDiscount} setVenueNtable={setVenueNtable} venueNtable={venueNtable} basketItems={basketItems} setBasketItems={setBasketItems} user={user} />} />

        <Route path="/settings" element={<Settings venues={venues} />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
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
