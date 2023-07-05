import React, { useState, useEffect, useRef } from "react";
import { getVenueById } from "../../utils/BasketUtils";
import { AiFillCaretRight } from "react-icons/ai";

const VenueNTable = ({ user, venues, venueNtable, setVenueNtable }) => {
  const [searchLocationValue, setLocationSearchValue] = useState("");
  const [searchTableValue, setTableSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const searchInputRef2 = useRef(null);

  useEffect(() => {
    if (!venueNtable.venue && !localStorage.getItem('venueID')) searchInputRef.current.focus();
    if (!venueNtable.table && venueNtable.venue)
      searchInputRef2.current.focus();
  }, [venueNtable]);

  const handleLocationInputChange = (event) => {
    setLocationSearchValue(event.target.value);
  };
  const handleTableInputChange = (event) => {
    setTableSearchValue(event.target.value);
  };

  const handleLocation = (id) => {
    localStorage.setItem('venueID', id)
    setVenueNtable((prevValues) => ({ ...prevValues, venue: id }));
  };

  const handleTable = (id) => {
    setVenueNtable((prevValues) => ({ ...prevValues, table: id }));
  };

  if (!venueNtable.venue)
    return (
      <div className="absolute inset-0 bg-[--c60] z-10 overflow-y-scroll flex flex-col items-center">
        {/* location */}
        <div
          className={`animate-fadeUP1 flex flex-col max-w-[400px] transition-all w-[100%] ${
            venueNtable.venue ? "opacity-0 absolute" : "z-20"
          }`}
        >
          <p className="text-center font-bold text-xl mt-4">
            Select your location
          </p>
          <div className="relative w-[100%]">
            <input
              ref={searchInputRef}
              name="venuesearchinput"
              type="text"
              placeholder="Search..."
              className="w-[100%] mx-auto pl-10 pr-10 py-2 my-2 rounded"
              value={searchLocationValue}
              onChange={handleLocationInputChange}
            />
            <span className="absolute top-[28px] left-2 -translate-y-3">
              🔍
            </span>
            <button
              onClick={() => setLocationSearchValue("")}
              className={`absolute top-[28px] right-5 -translate-y-3 ${
                searchLocationValue ? "" : "hidden"
              }
									`}
            >
              ✖
            </button>
          </div>

          {venues
            .filter(
              (venue) =>
                venue.name
                  .toLowerCase()
                  .indexOf(searchLocationValue.toLowerCase()) >= 0 ||
                venue.address
                  .toLowerCase()
                  .indexOf(searchLocationValue.toLowerCase()) >= 0
            )
            .map((venue, index) => {
              return (
                <div
                  onClick={() => handleLocation(venue.id)}
                  key={index}
                  className="my-2 w-[100%] bg-[--c30] rounded px-3 py-2 border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none"
                >
                  <div className="flex flex-nowrap">
                    <p className="font-bold text-lg truncate w-[100%]">
                      {venue.name}
                    </p>
                    <AiFillCaretRight className=" bg-[--c1] rounded my-auto p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
                  </div>
                  <span className="text-sm">{venue.address}</span>
                </div>
              );
            })}
        </div>
      </div>
    );

  if (!venueNtable.table && venueNtable.venue)
    return (
      <div className="fixed inset-0 bg-[--c60] z-10 overflow-y-scroll flex flex-col items-center">
        {/* table number */}

        <div
          className={`flex flex-col max-w-[400px] transition-all ${
            !venueNtable.table && !venueNtable.venue
              ? "opacity-0 absolute"
              : "animate-fadeUP1 z-10"
          } `}
        >
          <p className="text-center font-bold text-xl mt-4">
            Select your table
          </p>
          <div className="relative mx-4">
            <input
              ref={searchInputRef2}
              name="venuesearchinput"
              type="number"
              placeholder="Search..."
              className="w-[98%] mx-auto pl-10 pr-10 py-2 my-2 rounded "
              value={searchTableValue}
              onChange={handleTableInputChange}
              min="0"
            />
            <span className="absolute top-[28px] left-2 -translate-y-3">
              🔍
            </span>
            <button
              onClick={() => setTableSearchValue("")}
              className={`absolute top-[28px] right-5 -translate-y-3 ${
                searchTableValue ? "" : "hidden"
              }
									`}
            >
              ✖
            </button>
          </div>
          {getVenueById(venues, localStorage.getItem('venueID')).table
            .filter((venue)=>String(venue).includes(String(searchTableValue)))
            .map((venue, index) => {
              return (
                <div
                  onClick={() => handleTable(venue)}
                  key={index}
                  className="my-2 bg-[--c30] rounded px-3 py-2 border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none"
                >
                  <div className="flex flex-nowrap">
                    <p className="font-bold text-lg truncate w-[100%]">
                      Table {venue}
                    </p>
                    <AiFillCaretRight className=" bg-[--c1] rounded my-auto p-[2px] text-xl font-bold border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
};

export default VenueNTable;
