import React, { useEffect, useState } from "react";
import { updateRota, fetchUserDetails } from "../../../utils/DataTools";

const ROTAPerson = ({ person, currentLookedUpDates, index, weekNumber, rota, setRota }) => {
  const [modal, setModal] = useState(false);
  const [timesModal, setTimesModal] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [timesmodalData, setTimesModalData] = useState([]);
  const [typeOfData, setTypeOfData] = useState("");
  const [tempDay, setTempDay] = useState("");
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [hoursRoted, setHoursRoted] = useState(0);

  const handleSave = () => {
    if (timesmodalData === "HOLIDAY") {
      let updatedOne = rota[person.email];
      updatedOne[tempDay][typeOfData] = [timesmodalData];

      setRota((prev) => {
        const updatedRota = { ...prev };
        updatedRota[person.email] = updatedOne;
        updateRota(weekNumber, currentLookedUpDates, updatedRota);
        return updatedRota;
      });
    } else {
      let updatedOne = rota[person.email];
      updatedOne[tempDay][typeOfData] = [];

      timesmodalData.forEach((date) => {
        updatedOne[tempDay][typeOfData].push(`${date.start} - ${date.end}`);
      });

      setRota((prev) => {
        const updatedRota = { ...prev };
        updatedRota[person.email] = updatedOne;
        updateRota(weekNumber, currentLookedUpDates, updatedRota);
        return updatedRota;
      });
    }
    setTimesModal(!timesModal);
  };

  const openPopup = async (user) => {
    setModalData(await fetchUserDetails(user.email, weekNumber));
    setModal(!modal);
  };

  const editTimes = (data, day, type) => {
    setTypeOfData(type);
    if (!data) {
      console.log("hey no data!");
      setTimesModalData({ start: "07:00", end: "23:00" });
      setTempDay(day);
      setTimesModal(!timesModal);
    } else if (data[0] === "HOLIDAY") {
      setTempDay(day);
      setTimesModalData(data[0]);
      setTimesModal(!timesModal);
    } else {
      let td = [];
      try {
        data.forEach((dataz) => {
          td.push({ start: String(dataz).split(" - ")[0], end: String(dataz).split(" - ")[1] });
        });
        setTempDay(day);
        setTimesModalData(td);
        setTimesModal(!timesModal);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleTimeChange = (index, field, value) => {
    const updatedTimes = [...timesmodalData];
    updatedTimes[index][field] = value;
    setTimesModalData(updatedTimes);
  };

  const handleDelete = (index) => {
    if (index === "HOLIDAY") {
      console.log("Handle delete holiday");
      setTimesModalData([]);
    } else {
      let temp = timesmodalData.filter((item) => item !== timesmodalData[index]);
      setTimesModalData(temp);
    }
  };

  const handleInsert = (type) => {
    if (type === "HOLIDAY") {
      setTimesModalData("HOLIDAY");
    } else if (type === "TIME") {
      if (timesmodalData.length < 4) {
        setTimesModalData((prev) => [...prev, { start: "07:00", end: "23:00" }]);
      }
    }
  };

  return (
    <div key={index + "asdx"} className="tableData grid grid-cols-8 w-[100%] gap-2 font-[600]">
      {timesModal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setTimesModal(!timesModal) : null)}>
          <div className="fixed right-0 left-[25%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center justify-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setTimesModal(!timesModal)}>
              ◀ Cancel
            </button>

            <div className="flex flex-col gap-4 justify-center">
              <p className="text-lg border-b-2">
                {tempDay} <span className="capitalize">{typeOfData}</span> Data
              </p>
              {timesmodalData === "HOLIDAY" && (
                <div className={`py-1 rounded-lg text-center shadow-md flex flex-nowrap gap-4 justify-between`} key={"HOLIDAYdqwdqw"} title="Set ROTA">
                  <span className="my-auto px-4">HOLIDAY</span>
                  <span onClick={() => handleDelete("HOLIDAY")} className="p-2">
                    ❌
                  </span>
                </div>
              )}

              {timesmodalData !== "HOLIDAY" &&
                timesmodalData.map((time, indexNumber) => {
                  if (time === "HOLIDAY") {
                    return (
                      <div className={`py-1 rounded-lg text-center shadow-md flex flex-nowrap gap-4 justify-between`} key={"HOLIDAYdqwdqw"} title="Set ROTA">
                        <span className="my-auto px-4">HOLIDAY</span>
                        <span onClick={() => handleDelete("HOLIDAY")} className="p-2">
                          ❌
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <div className={`py-1 px-2 my-2 rounded-md text-center shadow-md flex flex-nowrap gap-4`} key={indexNumber + "dqwdqw"} title="Set ROTA">
                        <input className="m-1 px-2 timeStyle " type="time" value={time.start} onChange={(e) => handleTimeChange(indexNumber, "start", e.target.value)} name={`start-${indexNumber}`} />
                        <span className="my-auto">↔</span>
                        <input className="m-1 px-4 timeStyle" type="time" value={time.end} onChange={(e) => handleTimeChange(indexNumber, "end", e.target.value)} name={`end-${indexNumber}`} />
                        <span onClick={() => handleDelete(indexNumber)} className="p-2">
                          ❌
                        </span>
                      </div>
                    );
                  }
                })}
              <div className="grid grid-cols-2 gap-4">
                <button disabled={timesmodalData.length >= 4 || timesmodalData === "HOLIDAY"} onClick={() => handleInsert("TIME")} className={`${timesmodalData.length >= 4 ? "text-gray-50 bg-gray-300/50" : "bg-gray-300"} py-1  rounded-lg text-center shadow-md px-4 active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition`}>
                  +Time
                </button>
                <button disabled={String(timesmodalData).length > 0} onClick={() => handleInsert("HOLIDAY")} className={`${String(timesmodalData).length > 0 ? "text-gray-50 bg-gray-300/50" : "bg-gray-300"} py-1  rounded-lg text-center shadow-md active:shadow-inner px-4 border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition`}>
                  +Holiday
                </button>
              </div>

              <button className="timeStyle shadow-md p-4 my-4 text-xl animate-fadeUP1 border-b-2 border-b-green-300 flex justify-between" onClick={handleSave}>
                <span className="text-green-300">◀ </span>
                <span className="m-auto">Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
          <div className="fixed right-0 left-[25%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setModal(!modal)}>
              ◀ Cancel
            </button>
            <div className="overflow-auto px-2 grid grid-cols-2 gap-4 p-4 m-2">
              <img src={"../assets/drinks.jpg"} className="h-[160px] w-[auto] rounded-full aspect-square" />
              <div className="flex flex-col text-xl text-start">
                <p className="font-bold border-b-2">{modalData[0].displayName}</p>
                <p>{modalData[0].position}</p>
                <p>{modalData[0].team}</p>
                <p>{modalData[0].worktype}</p>
                <p>{modalData[0].phone}</p>
                <p>{modalData[0].email}</p>
              </div>

              <div className="col-span-2 gap-4 grid grid-cols-[1fr_10px_.4fr] p-2 border-2 shadow-lg">
                <p className="text-end">This Week's Scheduled hours</p>
                <span>|</span>
                <p className="text-start">{modalData[0].rotedHours}h</p>

                <p className="text-end">Paid Holiday Remaining</p>
                <span>|</span>
                <p className="text-start">-</p>
                <p className="col-span-3">Available when payroll is enabled*</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* name */}
      <p onClick={() => openPopup(person)} className="font-bold py-4 bg-gray-300 rounded-lg shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition cursor-pointer">
        {person.displayName}
      </p>

      {daysOfWeek.map((day, index) => {
        const { roted, clocked } = person[day] || {};
        return (
          <div className={`dayLog${day} flex flex-col gap-2`} key={day}>
            {/* roted time */}
            {roted && roted.length > 0 && (
              <div onClick={() => editTimes(roted, day, "roted")} className={`cursor-pointer py-1 ${roted[0] === "HOLIDAY" ? "bg-indigo-300" : "bg-orange-300"} rounded-lg text-center shadow-md`} title="Set ROTA">
                {roted.map((time) => (
                  <p key={crypto.randomUUID()}>{time}</p>
                ))}
              </div>
            )}

            {/* clocked time */}
            {clocked && clocked.length > 0 && (
              <div onClick={() => editTimes(clocked, day, "clocked")} className="cursor-pointer grid grid-cols-1 py-1 bg-blue-300 rounded-lg text-center shadow-md">
                {clocked.map((clock) => (
                  <span key={crypto.randomUUID()}>{clock}</span>
                ))}
              </div>
            )}

            <div className="relative group">
              <p className="cursor-pointer py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>

              <div className="group-hover:flex hidden z-10 flex-col gap-4 my-4 absolute w-[100%] bg-white/90 rounded-lg border-2 border-black/30 shadow-lg shadow-black/60 p-2 top-1/2">
                <button onClick={() => editTimes(roted, day, "roted")} className="py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
                  +Rota
                </button>
                <button onClick={() => editTimes(clocked, day, "clocked")} className="py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">
                  +Clocked
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ROTAPerson;

{
  /* requests */
}
{
  /* disabling requests until STAFF APP ** is made but there is one example in the db using this format */
}
{
  /* {person.Sunday.requests.map((req, index) => {
      if (req.request === "OFF") {
        return (
          <div>
            <p className="bg-yellow-300 p-2 rounded-t-xl text-center text-xs">Req. Off</p>
            {!req.status && <p className="bg-yellow-300 p-2 rounded-b-xl text-center text-xs">- Pending -</p>}
            {req.status && req.status === "yes" && <p className="bg-green-300 p-2 rounded-b-xl text-center text-xs">Req. ✅</p>}
            {req.status && req.status === "no" && <p className="bg-red-400 p-2 rounded-b-xl text-center text-xs">Req. ❌</p>}
          </div>
        );
      }
      if (req.request === "HOLIDAY") {
        return (
          <div>
            <p className="bg-yellow-300 py-1 text-center rounded-t-lg">Req. Hol</p>
            {!req.status && <p className="bg-yellow-300 p-2 rounded-b-xl text-center text-xs">- Pending -</p>}
            {req.status && req.status === "yes" && <p className="bg-green-300 p-2 rounded-b-xl text-center text-xs">Req. ✅</p>}
            {req.status && req.status === "no" && <p className="bg-red-400 p-2 rounded-b-xl text-center text-xs">Req. ❌</p>}
          </div>
        );
      }
      if (req.request === "CUSTOM") {
        return (
          <div>
            <p className="bg-pink-300 p-2 rounded-t-xl text-center text-xs">{req.message}</p>
            {!req.status && <p className="bg-yellow-300 p-2 rounded-b-xl text-center text-xs">- Pending -</p>}
            {req.status && req.status === "yes" && <p className="bg-green-300 p-2 rounded-b-xl text-center text-xs">Req. ✅</p>}
            {req.status && req.status === "no" && <p className="bg-red-400 p-2 rounded-b-xl text-center text-xs">Req. ❌</p>}
          </div>
        );
      }
    })} */
}