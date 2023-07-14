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
        <Route path="/TablesPlan" element={<AdminTablePlan />} />
        <Route path="/Products" element={<AdminProducts />} />

        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
};

export default Admin;

const AdminDashboard = () => {
  return (
    <div>
      <p>hi AdminDashboard</p>
    </div>
  );
};

const AdminTablePlan = () => {
  return (
    <div>
      <p>hi AdminTablePlan</p>
    </div>
  );
};
const AdminProducts = () => {
  return (
    <div>
      <p>hi AdminProducts</p>
    </div>
  );
};
