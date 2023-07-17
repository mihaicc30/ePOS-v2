import React, { useEffect, useState } from "react";
import "./AdminROTA.css";

const AdminROTA = () => {
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState(false);

  const openPopup = (user) => {
    setModalData(user);
    setModal(!modal);
  };

  const [startDate, setStartDate] = useState(new Date()); // Default start date is the present week

  const handlePrevious = () => {
    const previousWeek = new Date(startDate);
    previousWeek.setDate(previousWeek.getDate() - 7); // Subtract 7 days to get the previous week
    setStartDate(previousWeek);
  };

  const handleNext = () => {
    const nextWeek = new Date(startDate);
    nextWeek.setDate(nextWeek.getDate() + 7); // Add 7 days to get the next week
    setStartDate(nextWeek);
  };

  return (
    <div className="flex flex-col overflow-y-auto relative">
      {modal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
          <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setModal(!modal)}>
              ◀ Cancel
            </button>

            <div className="overflow-auto px-2 grid grid-cols-2 gap-4 p-4 m-2">
              <img src={"../assets/drinks.jpg"} className="h-[160px] w-[auto] rounded-full aspect-square" />
              <div className="flex flex-col text-xl text-start">
                <p className="font-bold border-b-2">{modalData}</p>
                <p>Manager</p>
                <p>Management Team</p>
                <p>Full-Time</p>
                <p>07123 123 123</p>
              </div>

              <div className="col-span-2 flex justify-between gap-4">
                {/* <button className="bg-green-200 p-4 rounded-lg shadow-md border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">Update</button> */}
                <button className="ml-auto bg-red-400 p-4 rounded-lg shadow-md border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="text-xl font-bold p-2 underline relative">
        ROTA <span className=" absolute text-xs font-light top-2">*in future development</span>
      </p>

      <div className="grid grid-cols-8 w-[100%] gap-2">
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handlePrevious}>
          ◀ Previous
        </button>
        <button className="bg-gray-200 p-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0" onClick={handleNext}>
          Next ▶
        </button>
        <p className="text-xl col-span-2 bg-gray-100 text-center p-1 rounded-lg shadow-xl border-b-2 border-b-black">
          {startDate.toLocaleDateString()} - {new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </p>

        <span></span>
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
          <p>Teams</p>
          <p>Sunday</p>
          <p>Monday</p>
          <p>Tuesday</p>
          <p>Wednesday</p>
          <p>Thursday</p>
          <p>Friday</p>
          <p>Saturday</p>
        </div>
        <span className="border-b-2 border-b-gray-400"></span>
      </div>

      <div className="flex flex-col w-[100%] gap-2 mt-4 overflow-y-scroll ">
        <div className="tableData grid grid-cols-8 w-[100%] gap-2">
          <p className=" py-4 bg-green-300/50 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
        </div>

        <p className="border-b-2">Management</p>
        <div className="tableData grid grid-cols-8 w-[100%] gap-2">
          <p onClick={() => openPopup("Mihai Culea ID")} className="font-bold py-4 bg-gray-300 rounded-lg shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
            Mihai Culea
          </p>
          <div className="dayLogSunday flex flex-col gap-2">
            <p className="bg-yellow-300 p-2 rounded-xl text-center text-xs">Req. Off</p>
            <p className="bg-green-300 p-2 rounded-xl text-center text-xs">Req. ✅</p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogMonday flex flex-col gap-2">
            <p className="bg-yellow-300 p-2 rounded-xl text-center text-xs">Req. Off</p>
            <p className="bg-red-400 p-2 rounded-xl text-center text-xs">Req. ❌</p>
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <div className="flex flex-col flex-nowrap py-1 bg-blue-300 rounded-lg text-center shadow-md ">
              <p title="Actual Clock In/Out ROTA">11:55 - 15:13</p>
              <p title="Actual Clock In/Out ROTA">16:00 - 22:13</p>
            </div>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogTuesday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogWednesday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogThursday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogFriday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogSaturday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
        </div>

        <div className="tableData grid grid-cols-8 w-[100%] gap-2">
          <p onClick={() => openPopup("Ioana Culea ID")} className="font-bold py-4 bg-gray-300 rounded-lg shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
            Ioana Culea
          </p>
          <div className="dayLogSunday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <div className="flex flex-col flex-nowrap py-1 bg-blue-300 rounded-lg text-center shadow-md">
              <p title="Actual Clock In/Out ROTA">11:55 - 15:13</p>
              <p title="Actual Clock In/Out ROTA">16:00 - 22:13</p>
            </div>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogMonday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              11:00 - 22:00
            </p>
            <div className="flex flex-col flex-nowrap py-1 bg-blue-300 rounded-lg text-center shadow-md">
              <p title="Actual Clock In/Out ROTA">10:55 - 16:13</p>
              <p title="Actual Clock In/Out ROTA">17:15 - 22:13</p>
            </div>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogTuesday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              11:00 - 20:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogWednesday flex flex-col gap-2">
            <p className="bg-yellow-300 py-1 text-center rounded-lg">Req. Hol</p>
            <p className="py-1 bg-violet-300 rounded-lg text-center shadow-md" title="Set ROTA">
              HOLIDAY
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogThursday flex flex-col gap-2">
            <p className="bg-yellow-300 py-1 text-center rounded-lg">Req. Hol</p>
            <p className="py-1 bg-violet-300 rounded-lg text-center shadow-md" title="Set ROTA">
              HOLIDAY
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogFriday flex flex-col gap-2">
            <p className="bg-yellow-300 py-1 text-center rounded-lg">Req. Hol</p>
            <p className="py-1 bg-violet-300 rounded-lg text-center shadow-md" title="Set ROTA">
              HOLIDAY
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogSaturday flex flex-col gap-2">
            <p className="bg-yellow-300 py-1 text-center rounded-lg">Req. Hol</p>
            <p className="py-1 bg-violet-300 rounded-lg text-center shadow-md" title="Set ROTA">
              HOLIDAY
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
        </div>
        <p className="border-b-2">Supervisor</p>

        <div className="tableData grid grid-cols-8 w-[100%] gap-2">
          <p onClick={() => openPopup("Petrisor Predescu ID")} className="font-bold py-4 bg-gray-300 rounded-lg shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
            Petrisor Predescu
          </p>
          <div className="dayLogSunday flex flex-col gap-2">
            <p className="bg-pink-300 p-2 rounded-xl text-center text-xs">Can i please have morning off? can work from 3.</p>
            <p className="bg-green-400 p-2 rounded-xl text-center text-xs">Req. ✅</p>
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              16:00 - 22:00
            </p>
            <div className="flex flex-col flex-nowrap py-1 bg-blue-300 rounded-lg text-center shadow-md ">
              <p title="Actual Clock In/Out ROTA">15:55 - 22:13</p>
            </div>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogMonday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              16:00 - 22:00
            </p>
            <div className="flex flex-col flex-nowrap py-1 bg-blue-300 rounded-lg text-center shadow-md ">
              <p title="Actual Clock In/Out ROTA">15:55 - 22:13</p>
            </div>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogTuesday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogWednesday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogThursday flex flex-col gap-2">
            <p className="bg-pink-300 p-2 rounded-xl text-center text-xs">Have a party. Can i have off ?</p>
            <p className="bg-red-300 p-2 rounded-xl text-center text-xs">Req. ❌</p>
            <p className="bg-pink-300 p-2 rounded-xl text-center text-xs">How about off tomorrow ?</p>
            <p className="bg-red-300 p-2 rounded-xl text-center text-xs">Req. ❌</p>
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogFriday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogSaturday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              12:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
        </div>

        <p className="border-b-2">Staff</p>
        <div className="tableData grid grid-cols-8 w-[100%] gap-2">
          <p onClick={() => openPopup("Constantin Cristian Florea ID")} className="font-bold py-4 bg-gray-300 rounded-lg shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
            Constantin Cristian Florea
          </p>
          <div className="dayLogSunday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              16:00 - 22:00
            </p>
            <div className="flex flex-col flex-nowrap py-1 bg-blue-300 rounded-lg text-center shadow-md ">
              <p title="Actual Clock In/Out ROTA">15:55 - 22:13</p>
            </div>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogMonday flex flex-col gap-2">
            <p className="bg-pink-300 p-2 rounded-xl text-center text-xs">Got uni exam. Cant work.</p>
            <p className="bg-green-400 p-2 rounded-xl text-center text-xs">Req. ✅</p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogTuesday flex flex-col gap-2">
            <p className="bg-pink-300 p-2 rounded-xl text-center text-xs">Got uni exam. Cant work.</p>
            <p className="bg-green-400 p-2 rounded-xl text-center text-xs">Req. ✅</p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogWednesday flex flex-col gap-2">
            <p className="bg-pink-300 p-2 rounded-xl text-center text-xs">Got uni exam. Cant work.</p>
            <p className="bg-green-400 p-2 rounded-xl text-center text-xs">Req. ✅</p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogThursday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogFriday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              11:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogSaturday flex flex-col gap-2">
            <p className="py-1 bg-orange-300 rounded-lg text-center shadow-md" title="Set ROTA">
              11:00 - 22:00
            </p>
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
        </div>
        <div className="tableData grid grid-cols-8 w-[100%] gap-2">
          <p onClick={() => openPopup("Constantin Cristian Florea ID")} className="font-bold py-4 bg-gray-300 rounded-lg shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
            Constantin Cristian Florea
          </p>
          <div className="dayLogSunday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogMonday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogTuesday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogWednesday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogThursday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogFriday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogSaturday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
        </div>
        <div className="tableData grid grid-cols-8 w-[100%] gap-2">
          <p onClick={() => openPopup("Constantin Cristian Florea ID")} className="font-bold py-4 bg-gray-300 rounded-lg shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
            Constantin Cristian Florea
          </p>
          <div className="dayLogSunday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogMonday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogTuesday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogWednesday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogThursday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogFriday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogSaturday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
        </div>
        <div className="tableData grid grid-cols-8 w-[100%] gap-2">
          <p onClick={() => openPopup("Constantin Cristian Florea ID")} className="font-bold py-4 bg-gray-300 rounded-lg shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
            Constantin Cristian Florea
          </p>
          <div className="dayLogSunday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogMonday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogTuesday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogWednesday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogThursday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogFriday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
          <div className="dayLogSaturday flex flex-col gap-2">
            <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
          </div>
        </div>
      </div>

      <span className="border-b-2 border-b-gray-400 my-2"></span>
      <div className="grid grid-cols-8 w-[100%] gap-2 text-center">
        <span>Legend:</span>
        <p className="bg-yellow-300 rounded-lg">Request</p>
        <p className="bg-green-300 rounded-lg">Approved</p>
        <p className="bg-red-400 rounded-lg">Refused</p>
        <p className="bg-orange-300 rounded-lg">Schedguled ROTA</p>
        <p className="bg-blue-300 rounded-lg">Clocked In/Out</p>
        <p className="bg-violet-300 rounded-lg">Holiday</p>
        <p className="bg-pink-300 rounded-lg">Custom</p>
      </div>

      <span className="border-b-2 border-b-gray-400 my-2"></span>
    </div>
  );
};

export default AdminROTA;
