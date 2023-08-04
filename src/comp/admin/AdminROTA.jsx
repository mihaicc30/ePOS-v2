import React, { useEffect, useState } from "react";
import "./AdminROTA.css";
import { getRotaOfTheWeek } from "../../utils/DataTools";
import ROTAPerson from "./AdminComp/ROTAPerson"

const AdminROTA = () => {
 

  const [weekNumber, setWeekNumber] = useState(null);
  const [currentYear, setcurrentYear] = useState(new Date().getFullYear());
  const [currentLookedUpDates, setCurrentLookedUpDates] = useState("");
  const [startWeek, setStartWeek] = useState(null);
  const [rota, setRota] = useState([]);

  useEffect(() => {
    getWeekNumber();
  }, []);

  useEffect(() => {
    if (!weekNumber) return;
    const datesOfWeek = getDatesOfWeek(weekNumber, currentYear);
    setCurrentLookedUpDates(datesOfWeek);
  }, [weekNumber]);

  useEffect(() => {
    (async () => {
      if (!weekNumber) return;
      // console.log("double checking the week number", weekNumber);
      setRota(await getRotaOfTheWeek(weekNumber));
    })();
  }, [startWeek]);

  const getWeekNumber = () => {
    setWeekNumber(getCurrentWeekNumber());
    return;
  };

  const getCurrentWeekNumber = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    return weekNumber;
  };

  const getDatesOfWeek = (weekNumber, year) => {
    const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    setStartWeek(startDate);
    return startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString();
  };
  const handlePrevious = () => {
    setWeekNumber(weekNumber - 1);
  };

  const handleNext = () => {
    setWeekNumber(weekNumber + 1);
  };

  const handlePrint = () => {
    let printContents = document.querySelector(".rotaTableData").innerHTML;

    const popup = window.open("", "_blank");
    popup.document.head.innerHTML = `
      <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
      <style>
      @page {
        size: landscape;  
      }
      .bg-orange-300 {
        --tw-bg-opacity: 1;
        background-color: rgb(253 186 116 / var(--tw-bg-opacity));
      }
      .bg-violet-300 {
        --tw-bg-opacity: 1;
        background-color: rgb(196 181 253 / var(--tw-bg-opacity));
      }
      </style>
      `;
    popup.document.body.innerHTML = `
      <div class="w-full h-full bg-white">
        ${printContents}
      </div>  
    `;

    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <div className="rotaTableData flex flex-col overflow-y-auto relative h-[100%]">
      
      <p className="text-xl font-bold p-2 underline relative">ROTA</p>

      <div className="grid grid-cols-8 w-[100%] gap-2">
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handlePrevious}>
          ◀ Previous
        </button>
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handleNext}>
          Next ▶
        </button>
        <p className="text-xl col-span-2 bg-gray-100 text-center p-1 rounded-lg shadow-xl border-b-2 border-b-black">{currentLookedUpDates}</p>

        <button onClick={handlePrint} className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
          Print
        </button>
        <button onClick={() => console.log("dev**to implement")} className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
          Reset
        </button>
        <button onClick={() => console.log("dev**to implement")} className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
          Copy
        </button>
        <button onClick={() => console.log("dev**to implement")} className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
          Save
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-4 w-[100%]">
        <div className="tableHeaders grid grid-cols-8 w-[100%] gap-2 text-center">
          {startWeek && (
            <>
              <div className="shadow-md p-2 flex flex-col">
                <p className="text-xl text-center">Teams</p>
                <p className="text-xs text-center">Week {weekNumber}</p>
              </div>
              <div className="shadow-md p-2 flex flex-col">
                <p className="text-xl text-center">Sunday</p>
                <p className="text-xs text-center">{new Date(startWeek).toLocaleDateString()}</p>
              </div>
              <div className="shadow-md p-2 flex flex-col">
                <p className="text-xl text-center">Monday</p>
                <p className="text-xs text-center">{new Date(startWeek.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div className="shadow-md p-2 flex flex-col">
                <p className="text-xl text-center">Tuesday</p>
                <p className="text-xs text-center">{new Date(startWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div className="shadow-md p-2 flex flex-col">
                <p className="text-xl text-center">Wednesday</p>
                <p className="text-xs text-center">{new Date(startWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div className="shadow-md p-2 flex flex-col">
                <p className="text-xl text-center">Thursday</p>
                <p className="text-xs text-center">{new Date(startWeek.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div className="shadow-md p-2 flex flex-col">
                <p className="text-xl text-center">Friday</p>
                <p className="text-xs text-center">{new Date(startWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div className="shadow-md p-2 flex flex-col">
                <p className="text-xl text-center">Saturday</p>
                <p className="text-xs text-center">{new Date(startWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </>
          )}
        </div>
        <span className="border-b-2 border-b-gray-400"></span>
      </div>

      <div className="flex flex-col w-[100%] gap-2 mt-4 overflow-y-scroll h-[100%]">
        {rota && Object.values(rota).length > 0 &&
          Object.values(rota)
            .sort((a, b) => {
              const teamOrder = {
                Management: 0,
                Staff: 1,
                Chef: 2,
                KP: 3,
              };
              return teamOrder[a.team] - teamOrder[b.team];
            })
            .map((person, index) => {
              if(!person)return
              let tempTeamp = `rotaTeam${person.team}`
              return (
                  <ROTAPerson key={index + "asd"} index={index} person={person} weekNumber={weekNumber} rota={rota} setRota={setRota}/>
              );
            })}
      </div>

      <span className="border-b-2 border-b-gray-400 my-2"></span>
      <div className="grid grid-cols-8 w-[100%] gap-2 text-center">
        <span>Legend:</span>
        <p className="bg-yellow-300 rounded-lg">Request</p>
        <p className="bg-green-300 rounded-lg">Approved</p>
        <p className="bg-red-400 rounded-lg">Refused</p>
        <p className="bg-orange-300 rounded-lg">ROTA</p>
        <p className="bg-blue-300 rounded-lg">Clocked</p>
        <p className="bg-violet-300 rounded-lg">Holiday</p>
        <p className="bg-pink-300 rounded-lg">Custom</p>
      </div>

      <span className="border-b-2 border-b-gray-400 my-2"></span>
    </div>
  );
};

export default AdminROTA;
