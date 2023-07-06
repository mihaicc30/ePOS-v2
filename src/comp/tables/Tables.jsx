import React, { useState, useEffect, useRef } from "react";
import VenueNTable from "../menu/VenueNTable";
import { getVenueById } from "../../utils/BasketUtils";
import { AiFillCaretRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./Tables.css";

const Tables = ({ user, venues, venueNtable, setVenueNtable }) => {
	const nav = useNavigate();
  const [searchLocationValue, setLocationSearchValue] = useState("");
  const [searchTableValue, setTableSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const searchInputRef2 = useRef(null);

  useEffect(() => {
    if (!venueNtable.venue && !localStorage.getItem("venueID")) searchInputRef.current.focus();
    if (!venueNtable.table && venueNtable.venue) searchInputRef2.current.focus();
  }, [venueNtable]);

  const handleLocationInputChange = (event) => {
    setLocationSearchValue(event.target.value);
  };
  const handleTableInputChange = (event) => {
    setTableSearchValue(event.target.value);
  };

  const handleLocation = (id) => {
    localStorage.setItem("venueID", id);
    setVenueNtable((prevValues) => ({ ...prevValues, venue: id }));
  };

  const handleTable = (id) => {
    setVenueNtable((prevValues) => ({ ...prevValues, table: id }));
	nav("/Menu")
  };

  return (
    <div className="bg-[--c60] grid grid-cols-1 gap-4 overflow-y-hidden ">
      <div className={`flex flex-col transition-all animate-fadeUP1 z-10 p-12 overflow-y-scroll mx-auto text-3xl whitespace-nowrap select-none`}>
        {venueNtable.table && <p>Current Selected Table: {venueNtable.table}</p> }
		{!venueNtable.table && <p>Select Table: </p> }
      </div>

      <div className={`flex flex-col max-w-[600px] transition-all z-10 overflow-y-scroll pr-4 mx-auto w-[100%]`}>
        <p className="text-center font-bold text-xl mt-4">Select/Change your table</p>
        <div className="relative mx-4">
          <input ref={searchInputRef2} name="venuesearchinput" type="number" placeholder="Search..." className="w-[98%] mx-auto pl-10 pr-10 py-2 my-2 rounded " value={searchTableValue} onChange={handleTableInputChange} min="0" />
          <span className="absolute top-[28px] left-2 -translate-y-3">🔍</span>
          <button
            onClick={() => setTableSearchValue("")}
            className={`absolute top-[28px] right-5 -translate-y-3 ${searchTableValue ? "" : "hidden"}
									  `}>
            ✖
          </button>
        </div>
        {getVenueById(venues, localStorage.getItem("venueID"))
          .table.filter((venue) => String(venue).includes(String(searchTableValue)))
          .map((venue, index) => {
            return (
              <div onClick={() => handleTable(venue)} key={index} className="my-2 bg-[--c30] rounded px-3 py-2 border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                <div className="flex flex-nowrap">
                  <p className="font-bold text-lg truncate w-[100%]">Table {venue}</p>
                  <AiFillCaretRight className=" bg-[--c1] rounded my-auto p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Tables;
