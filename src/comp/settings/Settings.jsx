import React, { useEffect, useState } from "react";
import "./Settings.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AiFillCaretRight } from "react-icons/ai";
import { auth } from "../../firebase/config.jsx";
import { getVenueById } from "../../utils/BasketUtils";

const Settings = ({ venues }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [defaultVenue, setDefaultVenue] = useState();

  useEffect(() => {
    setUser({ email: localStorage.getItem("email"), displayName: localStorage.getItem("displayName") });
    let defaultVenue = getVenueById(venues, localStorage.getItem("venueID"));
    setDefaultVenue({ name: defaultVenue.name, address: defaultVenue.address });
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 p-4 h-[100%] w-[100%] overflow-auto">
        <p className="font-bold text-lg pb-4 border-b-2">Account Services</p>

        <div className="grid grid-cols-2 border-b-2 p-4 m-4 gap-4 max-[500px]:grid-cols-1">
          <div className="flex flex-col border-b-2 pb-4 my-4">
            <p className="font-bold p-0 mb-2 border-b-2">Current user</p>
            <input type="text" className="py-1 px-3 my-1 rounded" defaultValue={user?.displayName} placeholder="User Name" />
            <input type="text" className="py-1 px-3 my-1 rounded" defaultValue={user?.email} placeholder="User Email" />
            <button className="my-auto mr-auto bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">Update Email</button>
          </div>

          <div className="flex flex-col border-b-2 pb-4 my-4">
            <p className="font-bold p-0 mb-2 border-b-2">Default Venue</p>
            <input type="text" defaultValue={defaultVenue?.name} className="px-3" readOnly />
            <input type="text" defaultValue={defaultVenue?.address} className="p-0 m-0 px-3" readOnly />
            <button className="mt-auto mr-auto bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">Update Venue</button>
          </div>

          <div className="flex flex-col border-b-2 pb-4 my-4">
            <p className="font-bold p-0 mb-2 border-b-2">Update Pin</p>
            <input type="text" className="py-1 my-1 rounded" defaultValue="" placeholder="New Pin" autoComplete="false" />
            <button className="mt-auto mr-auto bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">Update Pin</button>
          </div>

          <div className="flex flex-col border-b-2 pb-4 my-4">
            <p className="font-bold p-0 mb-2 border-b-2">Update Fingerprint</p>
            <button className="mt-auto mr-auto bg-[--c1] rounded px-3 py-1 font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">Start Scan</button>
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
          <div className="inline-flex items-center justify-between" onClick={() => navigate("/T&C")}>
            <p>T&C</p>
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
