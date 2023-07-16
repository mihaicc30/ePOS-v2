import AdminDashboard from "./AdminDashboard";
import AdminForecasts from "./AdminForecasts";
import AdminTablePlan from "./AdminTablePlan";
import AdminProducts from "./AdminProducts";
import AdminReceipts from "./AdminReceipts";
import AdminROTA from "./AdminROTA";
import AdminPayroll from "./AdminPayroll";
import AdminSignout from "./AdminSignout";

import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import Page404 from "../Page404";
import { Routes, Route, Outlet, NavLink, BrowserRouter } from "react-router-dom";

const Admin = ({ weeklyForecast, setWeeklyForecast, menuitems, dayForecast, setDayForecast, tables, setTables, draggingIndex, setDraggingIndex, showArea, setshowArea, uniqueAreas, setuniqueAreas, venues, venueNtable, setVenueNtable }) => {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard weeklyForecast={weeklyForecast} setWeeklyForecast={setWeeklyForecast} dayForecast={dayForecast} setDayForecast={setDayForecast} />} />
        <Route path="/Forecasts" element={<AdminForecasts dayForecast={dayForecast} setDayForecast={setDayForecast} weeklyForecast={weeklyForecast} setWeeklyForecast={setWeeklyForecast} />} />
        <Route path="/TablesPlan" element={<AdminTablePlan tables={tables} setTables={setTables} draggingIndex={draggingIndex} setDraggingIndex={setDraggingIndex} showArea={showArea} setshowArea={setshowArea} uniqueAreas={uniqueAreas} setuniqueAreas={setuniqueAreas} venues={venues} venueNtable={venueNtable} setVenueNtable={setVenueNtable} />} />
        <Route path="/Products" element={<AdminProducts menuitems={menuitems} />} />
        <Route path="/Receipts" element={<AdminReceipts />} />
        <Route path="/ROTA" element={<AdminROTA />} />
        <Route path="/Payroll" element={<AdminPayroll />} />
        <Route path="/Signout" element={<AdminSignout />} />

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default Admin;
