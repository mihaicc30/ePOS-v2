import React from "react";
import { Routes, Route, Outlet, NavLink, BrowserRouter } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-nowrap fixed inset-0 bg-gray-50">
      <AdminNav />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

const AdminNav = () => {
  return (
    <div className={`flex flex-col`}>
      <button>🍔</button>
      <p className="border-y-2 py-2 my-[5vh] text-xl">Admin Menu</p>
      <NavLink to="/Admin/">Dashboard</NavLink>
      <NavLink to="/Admin/TablesPlan">Tables Plan</NavLink>
      <NavLink to="/Admin/Products">Products</NavLink>
      <NavLink to="/Admin/Receipts">Receipts</NavLink>
      <NavLink to="/Admin/ROTA">ROTA</NavLink>
      <NavLink to="/Admin/Payroll">Payroll</NavLink>
    </div>
  );
};
