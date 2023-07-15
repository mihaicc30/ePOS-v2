import AdminDashboard from './AdminDashboard';
import AdminForecasts from './AdminForecasts';
import AdminTablePlan from './AdminTablePlan';
import AdminProducts from './AdminProducts';
import AdminReceipts from './AdminReceipts';
import AdminROTA from './AdminROTA';
import AdminPayroll from './AdminPayroll';
import AdminSignout from './AdminSignout';


import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import Page404 from "../Page404";
import { Routes, Route, Outlet, NavLink, BrowserRouter } from "react-router-dom";

const Admin = () => {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/Forecasts" element={<AdminForecasts />} />
        <Route path="/TablesPlan" element={<AdminTablePlan />} />
        <Route path="/Products" element={<AdminProducts />} />
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