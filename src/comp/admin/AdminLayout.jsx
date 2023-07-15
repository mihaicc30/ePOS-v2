import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, NavLink, BrowserRouter, useLocation } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";

const AdminLayout = () => {
  return (
    <div className="flex flex-nowrap fixed inset-0 bg-gray-50">
      <AdminNav />
      <div className="flex-grow flex flex-col">
        <div className="border-y-2 text-xl flex flex-row items-baseline p-2 gap-4">
          Admin 
          <RiAdminLine className="text-xl"/>
          {localStorage.getItem("displayName")}
        </div>
        <div className="border-2 flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

const AdminNav = () => {
  const [nav, setNav] = useState(true);

  return (
    <div className={`flex flex-col transition flex-nowrap`}>
      <button className={`px-auto py-6 border-2`} onClick={() => setNav(!nav)}>
        🍔
      </button>

      <NavLink to="/Admin/" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} ${window.location.pathname === "/Admin" ? "bg-orange-300" : ""} py-2 my-2 ${nav ? "pr-20":""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Dashboard" : "🦆"}
      </NavLink>
      <NavLink to="/Admin/Forecasts" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "":""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Forecasts" : "🐜"}
      </NavLink>
      <NavLink to="/Admin/TablesPlan" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "":""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Tables Plan" : "🐜"}
      </NavLink>
      <NavLink to="/Admin/Products" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "":""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Products" : "🐜"}
      </NavLink>
      <NavLink to="/Admin/Receipts" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "":""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Receipts" : "🐜"}
      </NavLink>
      <NavLink to="/Admin/ROTA" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "":""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "ROTA" : "🐜"}
      </NavLink>
      <NavLink to="/Admin/Payroll" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "":""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Payroll" : "🐜"}
      </NavLink>
      <NavLink to="/Admin/Signout" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "":""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Signout" : "🐜"}
      </NavLink>
    </div>
  );
};
