import React, { useEffect, useState } from "react";
import { getVenueById } from "../../utils/BasketUtils";

const BillTimeline = ({ setBillTimeline, basketItems, billTimelineAdminData, venueNtable, venues }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50">
      <div className="fixed top-0 bottom-0 right-0 left-[39%] bg-gray-100 z-60 overflow-auto">
        <button className="absolute top-0 left-0 p-4 text-3xl animate-fadeUP1" onClick={() => setBillTimeline(false)}>
          ◀ Close
        </button>
        <div className="flex flex-col items-center mt-12">
          {venueNtable ? (
            <>
              <p>{getVenueById(venues, venueNtable.venue).name}</p>
              <p>{getVenueById(venues, venueNtable.venue).address}</p>
              <p>Table {venueNtable.table}</p>
              <span className="border-b-2 border-b-gray-400 h-2 w-[100%] mb-8"></span>
              <p>Opened At:</p>
              <p>11:11 05/12/23</p>
            </>
          ) : (
            <>
              <p>{billTimelineAdminData.pubName}</p>
              <p>{billTimelineAdminData.address}</p>
              <p>Table {billTimelineAdminData.table}</p>
              <span className="border-b-2 border-b-gray-400 h-2 w-[100%] mb-8"></span>
              <p>Opened At:</p>
              <p>{new Date(billTimelineAdminData.tableOpenAt).toLocaleString()}</p>
            </>
          )}

          <div className="text-center">
            <div className="grid grid-cols-4 gap-4">
              <span></span>
              <span></span>
              <span className="h-6 w-2 border-l-2 border-l-black -translate-x-1/2"></span>
              <span></span>
            </div>
          </div>
          <div className="text-center">
            <div className="grid grid-cols-4 gap-4">
              <span></span>
              <span></span>
              <span className="timelineBullet h-6 w-6 rounded-full bg-gray-800 -translate-x-[62%]"></span>
              <span></span>
            </div>
          </div>
          <div className="text-center">
            <div className="grid grid-cols-4 gap-4">
              <span></span>
              <span></span>
              <span className="h-6 w-2 border-l-2 border-l-black -translate-x-1/2"></span>
              <span></span>
            </div>
          </div>

          <div className={`item grid grid-cols-1 rounded shadow-md text-center font-bold w-[100%]`}>
            <div className="grid grid-cols-[1fr_1fr_2fr_.7fr_1fr_1fr] gap-2 w-[100%]">
              <span>AddedBy</span>
              <p>TimeAdded</p>
              <p className="itemName line-clamp-1 pr-4">Name</p>
              <p>Price</p>
              <p>TimePrinted</p>
              <span>PrintedBy</span>
            </div>
          </div>

          <div className="text-center w-[100%]">
            {basketItems
              .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded))
              .map((menuItem, index) => (
                <div key={crypto.randomUUID()} className={`item grid grid-cols-1 ${menuItem.printed ? "bg-blue-300/50" : "bg-gray-100"} rounded shadow-md w-[100%]`}>
                  <div className="grid grid-cols-[1fr_1fr_2fr_.7fr_1fr_1fr] gap-2 w-[100%]">
                    <span>{menuItem.addedBy}</span>
                    <p>{new Date(menuItem.dateAdded).toLocaleTimeString()}</p>
                    <div>
                      <p title={menuItem.name} className="itemName line-clamp-2">
                        {menuItem.name}
                      </p>
                      {menuItem.message && <i>{menuItem.message}</i>}
                    </div>
                    <p>£{(menuItem.price * menuItem.qty).toFixed(2)}</p>

                    <p>{menuItem.datePrinted ? new Date(menuItem.datePrinted).toLocaleTimeString() : "Not printed."}</p>
                    <span>{menuItem.printedBy ? menuItem.printedBy : "-"}</span>
                  </div>
                </div>
              ))}
          </div>

          {!venueNtable && (
            <>
          <div className="text-center">
            <div className="grid grid-cols-4 gap-4">
              <span></span>
              <span></span>
              <span className="h-6 w-2 border-l-2 border-l-black -translate-x-1/2"></span>
              <span></span>
            </div>
          </div>
          <div className="text-center">
            <div className="grid grid-cols-4 gap-4">
              <span></span>
              <span></span>
              <span className="timelineBullet h-6 w-6 rounded-full bg-gray-800 -translate-x-[62%]"></span>
              <span></span>
            </div>
          </div>
              <p>Payment Taken At:</p>
              <p>{new Date(billTimelineAdminData.tableClosedAt).toLocaleString()}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillTimeline;
