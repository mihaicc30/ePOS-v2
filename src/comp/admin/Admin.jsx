import AdminDashboard from "./AdminDashboard";
import AdminReports from "./AdminReports";
import AdminTablePlan from "./AdminTablePlan";
import AdminProducts from "./AdminProducts";
import AdminReceipts from "./AdminReceipts";
import AdminROTA from "./AdminROTA";
import AdminStaff from "./AdminStaff";
import AdminPayroll from "./AdminPayroll";
import AdminCourses from "./AdminCourses";
import AdminBookings from "./AdminBookings";
import AdminSignout from "./AdminSignout";

import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import Page404 from "../Page404";
import { Routes, Route, Outlet, NavLink, BrowserRouter } from "react-router-dom";

const Admin = ({ setMenuitems, weeklyholiday, setWeeklyHoliday, weeklyWeather, setWeeklyWeather, weeklyForecast, setWeeklyForecast, menuitems, tables, setTables, draggingIndex, setDraggingIndex, showArea, setshowArea, uniqueAreas, setuniqueAreas, venues, venueNtable, setVenueNtable }) => {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard weeklyholiday={weeklyholiday} setWeeklyHoliday={setWeeklyHoliday} weeklyWeather={weeklyWeather} setWeeklyWeather={setWeeklyWeather} weeklyForecast={weeklyForecast} setWeeklyForecast={setWeeklyForecast} />} />
        <Route path="/Reports" element={<AdminReports weeklyForecast={weeklyForecast} setWeeklyForecast={setWeeklyForecast} weeklyholiday={weeklyholiday} setWeeklyHoliday={setWeeklyHoliday} weeklyWeather={weeklyWeather} setWeeklyWeather={setWeeklyWeather} />} />
        <Route path="/TablesPlan" element={<AdminTablePlan tables={tables} setTables={setTables} draggingIndex={draggingIndex} setDraggingIndex={setDraggingIndex} showArea={showArea} setshowArea={setshowArea} uniqueAreas={uniqueAreas} setuniqueAreas={setuniqueAreas} venues={venues} venueNtable={venueNtable} setVenueNtable={setVenueNtable} />} />
        <Route path="/Products" element={<AdminProducts menuitems={menuitems} setMenuitems={setMenuitems}/>} />
        <Route path="/Receipts" element={<AdminReceipts />} />
        <Route path="/ROTA" element={<AdminROTA />} />
        <Route path="/Staff" element={<AdminStaff />} />
        <Route path="/Payroll" element={<AdminPayroll />} />
        <Route path="/Courses" element={<AdminCourses />} />
        <Route path="/Bookings" element={<AdminBookings />} />
        <Route path="/Signout" element={<AdminSignout />} />

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default Admin;
