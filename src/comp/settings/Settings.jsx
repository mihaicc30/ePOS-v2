import React, { useEffect, useState, useRef } from "react";
import "./Settings.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AiFillCaretRight } from "react-icons/ai";
import { auth } from "../../firebase/config.jsx";
import { getVenueById } from "../../utils/BasketUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLeft } from "react-icons/ai";

const Settings = ({ venues }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    oldemail: localStorage.getItem("email"),
    email: localStorage.getItem("email"),
    olddisplayName: localStorage.getItem("displayName"),
    displayName: localStorage.getItem("displayName"),
    pin: "",
  });

  const updateUserDetails = async () => {
    try {
      const query = await fetch(`${import.meta.env.VITE_API}updateUserDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          v: import.meta.env.VITE_G,
          user,
        }),
      });
      const response = await query.json();
      console.log("Updated user details.", new Date().toUTCString());
      if (response.message === "ok") {
        toast.success(`Loggin out user to save changes.`, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/signout");
        }, 3000);
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateUserPin = async () => {
    try {
      const query = await fetch(`${import.meta.env.VITE_API}updateUserDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          v: import.meta.env.VITE_G,
          user,
        }),
      });
      const response = await query.json();
      console.log("Updated user pin.", new Date().toUTCString());
      if (response.message === "ok") {
        toast.success(`Loggin out user to save changes.`, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/signout");
        }, 3000);
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      <div className="flex flex-col gap-4 p-4 h-[100%] w-[100%] overflow-auto">
        <button className="mr-auto p-2 text-3xl" onClick={() => navigate(-1)}>
          <AiOutlineLeft />
        </button>
        <p className="font-bold text-lg pb-4 border-b-2">Account Services</p>

        <div className="grid grid-cols-2 border-b-2 p-4 m-4 gap-4 max-[500px]:grid-cols-1">
          <div className="flex flex-col border-b-2 pb-4 my-4">
            <p className="font-bold p-0 mb-2 border-b-2">Current user</p>
            <input
              type="text"
              className="py-1 px-3 my-1 rounded"
              defaultValue={localStorage.getItem("displayName")}
              placeholder="User Name"
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
            />
            <input
              type="text"
              className="py-1 px-3 my-1 rounded"
              defaultValue={localStorage.getItem("email")}
              placeholder="User Email"
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            <button onClick={updateUserDetails} className="my-auto mr-auto bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
              Update Details
            </button>
          </div>

          <div className="flex flex-col border-b-2 pb-4 my-4">
            <p className="font-bold p-0 mb-2 border-b-2">Update Pin</p>
            <input
              onChange={() =>
                setUser((prev) => ({
                  ...prev,
                  pin: e.target.value,
                }))
              }
              type="text"
              className="py-1 my-1 rounded"
              defaultValue=""
              placeholder="New Pin"
              autoComplete="false"
            />
            <button onClick={updateUserPin} className="mt-auto mr-auto bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
              Update Pin
            </button>
          </div>

          <div className="flex flex-col border-b-2 pb-4 my-4">
            <p className="font-bold p-0 mb-2 border-b-2">Update Fingerprint</p>
            <button disabled={true} className="mt-auto mr-auto bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#818080] disabled:active:shadow-none">
              Start Scan
            </button>
          </div>
        </div>

        <div className="inline-flex w-100 items-center justify-between border-b-2 pb-4 my-4" onClick={() => navigate("/Notifications")}>
          <p>
            Notifications: <span className="font-bold">0/0</span>
          </p>
          <AiFillCaretRight className="bg-[--c1] rounded p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
        </div>

        <div className="flex flex-col gap-2 border-b-2 pb-4 my-4">
          <div className="inline-flex items-center justify-between" onClick={() => navigate("/Contact")}>
            <p>Contact Us</p>
            <AiFillCaretRight className="bg-[--c1] rounded p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
          </div>
          <div className="inline-flex items-center justify-between" onClick={() => navigate("/FAQ")}>
            <p>FAQ</p>
            <AiFillCaretRight className="bg-[--c1] rounded p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
          </div>
          <div className="inline-flex items-center justify-between" onClick={() => navigate("/Privacy")}>
            <p>Privacy policy</p>
            <AiFillCaretRight className="bg-[--c1] rounded p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
          </div>
          <div className="inline-flex items-center justify-between" onClick={() => navigate("/Symbol")}>
            <p>Symbol Explanation</p>
            <AiFillCaretRight className="bg-[--c1] rounded p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
          </div>
          <div className="inline-flex items-center justify-between" onClick={() => navigate("/News")}>
            <p>Our News</p>
            <AiFillCaretRight className="bg-[--c1] rounded p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-b-2 pb-4 my-4">
          <div className="inline-flex items-center justify-between">
            <p>App Version: 1.0.0</p>
          </div>
          <div className="inline-flex items-center justify-between">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
