import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, NavLink, BrowserRouter, useLocation } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import { AiOutlineMenuFold, AiOutlineDashboard, AiOutlineStock } from "react-icons/ai";
import { MdTableBar, MdRestaurantMenu, MdReceiptLong } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { BsCalendar2Week } from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";
import { GoSignOut } from "react-icons/go";

const AdminLayout = () => {
  const [nav, setNav] = useState(true);

  useEffect(() => {}, [nav]);
  return (
    <div className={`grid ${nav ? "grid-cols-[150px,1fr]" : "grid-cols-[50px,1fr]"}  fixed inset-0 bg-gray-50`}>
      <AdminNav nav={nav} setNav={setNav} />
      <div className="flex-grow flex flex-col overflow-y-auto">
        <div className="border-y-2 text-xl flex flex-row items-center p-2 gap-4">
          <p className={`font-black tracking-widest`}>CCW POS</p>
          <img className={`w-[50px] rounded-xl p-1`} src="../assets/ic.jpg" />
          <span>Admin</span>
          <RiAdminLine className="text-xl" />
          {localStorage.getItem("displayName")}
          <span>|</span>
          <span>{new Date().toDateString()}</span>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

const AdminNav = ({ nav, setNav }) => {
  return (
    <div className={`flex flex-col transition flex-nowrap relative overflow-y-auto ${nav ? "w-[150px]" : "w-[54px]"}  border-r-2`}>
      <button className={`py-6 border-y-2 `} onClick={() => setNav(!nav)}>
        <AiOutlineMenuFold className={` ${nav ? "" : "rotate-180 "} transition text-3xl mx-auto`} />
      </button>

      <NavLink to="/Admin/" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} ${window.location.pathname === "/Admin" ? "bg-orange-300" : ""} py-2 my-2 ${nav ? "pr-4" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Dashboard" : <AiOutlineDashboard className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/Reports" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Reports" : <AiOutlineStock className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/TablesPlan" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Tables Plan" : <MdTableBar className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/Products" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Products" : <MdRestaurantMenu className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/Receipts" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Receipts" : <MdReceiptLong className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/Staff" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Staff" : <IoIosPeople className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/ROTA" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "ROTA" : <BsCalendar2Week className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/Payroll" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Payroll" : <TbPigMoney className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/Courses" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Courses" : <TbPigMoney className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/Bookings" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Bookings" : <TbPigMoney className="text-3xl mx-auto" />}
      </NavLink>
      <NavLink to="/Admin/Signout" className={({ isActive, isPending }) => `${isPending ? "pending " : ""} ${isActive ? "bg-orange-300 " : ""} py-2 my-2 ${nav ? "" : ""} text-xl border-b-2 whitespace-nowrap`}>
        {nav ? "Signout" : <GoSignOut className="text-3xl mx-auto" />}
      </NavLink>
    </div>
  );
};
