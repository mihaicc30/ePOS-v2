import React, { useEffect, useState } from "react";

const ROTAPerson = ({ person, index, weekNumber, rota, setRota }) => {
  const [modal, setModal] = useState(false);
  const [timesModal, setTimesModal] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [timesmodalData, setTimesModalData] = useState([]);

  const [tempDay, setTempDay] = useState("");

  const handleSave = () => {
    if (timesmodalData === "HOLIDAY") {
      let updatedOne = rota[person.email];
      updatedOne[tempDay]["roted"] = [timesmodalData];

      setRota((prev) => {
        const updatedRota = { ...prev };
        updatedRota[person.email] = updatedOne;
        return updatedRota;
      });
    } else {
      let updatedOne = rota[person.email];
      updatedOne[tempDay]["roted"] = [];

      timesmodalData.forEach((date) => {
        updatedOne[tempDay]["roted"].push([`${date.start} - ${date.end}`]);
      });

      setRota((prev) => {
        const updatedRota = { ...prev };
        updatedRota[person.email] = updatedOne;
        return updatedRota;
      });
    }
    setTimesModal(!timesModal);
  };

  const openPopup = (user) => {
    setModalData(user);
    setModal(!modal);
  };

  const editTimes = (data, day) => {
    if (data[0] === "HOLIDAY") {
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
    console.log("🚀 ~ file: ROTAPerson.jsx:40 ~ handleTimeChange ~ index:", index);
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
          <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center justify-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setTimesModal(!timesModal)}>
              ◀ Cancel
            </button>

            <button className="absolute top-20 left-0 p-4 text-xl animate-fadeUP1 border-b-2 border-b-green-300" onClick={handleSave}>
              <span className="text-green-300">◀ </span>Save
            </button>

            <div className="flex flex-col gap-4 justify-center">
              <p>{tempDay} Rota Data</p>
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
                      <div className={`py-1 rounded-lg text-center shadow-md flex flex-nowrap gap-4`} key={indexNumber + "dqwdqw"} title="Set ROTA">
                        <input className="px-4" type="time" value={time.start} onChange={(e) => handleTimeChange(indexNumber, "start", e.target.value)} name={`start-${indexNumber}`} />
                        <span className="my-auto">-</span>
                        <input className="px-4" type="time" value={time.end} onChange={(e) => handleTimeChange(indexNumber, "end", e.target.value)} name={`end-${indexNumber}`} />
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
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
          <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setModal(!modal)}>
              ◀ Cancel
            </button>

            <div className="overflow-auto px-2 grid grid-cols-2 gap-4 p-4 m-2">
              <img src={"../assets/drinks.jpg"} className="h-[160px] w-[auto] rounded-full aspect-square" />
              <div className="flex flex-col text-xl text-start">
                <p className="font-bold border-b-2">{modalData.displayName}</p>
                <p>Manager--tochange</p>
                <p>{modalData.team}</p>
                <p>Full-Time--tochange</p>
                <p>07123 123 123--tochange</p>
              </div>

              <div className="col-span-2 gap-4 grid grid-cols-[1fr_10px_.4fr] p-2 border-2 shadow-lg">
                <p className="text-end">This Week's Scheduled hours</p>
                <span>|</span>
                <p className="text-start">30h</p>

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

      <div className="dayLogSunday flex flex-col gap-2">
        {/* roted time */}
        {console.log(person.Sunday)}
        <div onClick={() => editTimes(person.Sunday.roted, "Sunday")} className={`py-1 ${person.Sunday ? "" : "hidden"} ${person.Sunday?.roted.length > 0 ? "" : "hidden"} ${person.Sunday?.roted[0] === "HOLIDAY" ? "bg-indigo-300" : "bg-orange-300"} rounded-lg text-center shadow-md`} title="Set ROTA">
          {person.Sunday.roted.map((time, indexNumber) => (
            <p key={crypto.randomUUID()}>{time}</p>
          ))}
        </div>

        {/* clocked time */}
        <div className={`${person.Sunday ? "grid" : "hidden"} ${person.Sunday?.clocked.length > 0 ? "grid" : "hidden"} grid-cols-1 py-1 bg-blue-300 rounded-lg text-center shadow-md `}>
          {person.Sunday?.clocked.map((clock, indexNumber) => {
            if (indexNumber % 2 == 0)
              return (
                <p title="Actual Clock In/Out ROTA" key={crypto.randomUUID()}>
                  <span>{clock}</span>
                  <span> - </span>
                  <span>{person.Sunday.clocked[indexNumber + 1] || "?"}</span>
                </p>
              );
          })}
        </div>
        <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
      </div>

      <div className="dayLogMonday flex flex-col gap-2">
        {/* roted time */}
        <div onClick={() => editTimes(person.Monday.roted, "Monday")} className={`${person.Monday ? "" : "hidden"} ${person.Monday?.roted.length > 0 ? "" : "hidden"} py-1 ${person.Monday?.roted[0] === "HOLIDAY" ? "bg-indigo-300" : "bg-orange-300"}  rounded-lg text-center shadow-md`} title="Set ROTA">
          {person.Monday?.roted.map((time, indexNumber) => (
            <p key={crypto.randomUUID()}>{time}</p>
          ))}
        </div>

        {/* clocked time */}
        <div className={`${person.Monday ? "grid" : "hidden"} ${person.Monday?.clocked.length > 0 ? "grid" : "hidden"} grid-cols-1 py-1 bg-blue-300 rounded-lg text-center shadow-md `}>
          {person.Monday?.clocked.map((clock, indexNumber) => {
            if (indexNumber % 2 == 0)
              return (
                <p title="Actual Clock In/Out ROTA" key={crypto.randomUUID()}>
                  <span>{clock}</span>
                  <span> - </span>
                  <span>{person.Monday?.clocked[indexNumber + 1] || "?"}</span>
                </p>
              );
          })}
        </div>
        <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
      </div>

      <div className="dayLogTuesday flex flex-col gap-2">
        {/* roted time */}
        <div onClick={() => editTimes(person.Tuesday.roted, "Tuesday")} className={`${person.Tuesday ? "" : "hidden"}  ${person.Tuesday?.roted.length > 0 ? "" : "hidden"} py-1 ${person.Tuesday?.roted[0] === "HOLIDAY" ? "bg-indigo-300" : "bg-orange-300"}  rounded-lg text-center shadow-md`} title="Set ROTA">
          {person.Tuesday?.roted.map((time, indexNumber) => (
            <p key={crypto.randomUUID()}>{time}</p>
          ))}
        </div>

        {/* clocked time */}
        <div className={`${person.Tuesday ? "grid" : "hidden"} ${person.Tuesday?.clocked.length > 0 ? "grid" : "hidden"} grid-cols-1 py-1 bg-blue-300 rounded-lg text-center shadow-md `}>
          {person.Tuesday?.clocked.map((clock, indexNumber) => {
            if (indexNumber % 2 == 0)
              return (
                <p title="Actual Clock In/Out ROTA" key={crypto.randomUUID()}>
                  <span>{clock}</span>
                  <span> - </span>
                  <span>{person.Tuesday?.clocked[indexNumber + 1] || "?"}</span>
                </p>
              );
          })}
        </div>
        <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
      </div>

      <div className="dayLogWednesday flex flex-col gap-2">
        {/* roted time */}
        <div onClick={() => editTimes(person.Wednesday.roted, "Wednesday")} className={`${person.Wednesday ? "" : "hidden"} ${person.Wednesday?.roted.length > 0 ? "" : "hidden"} py-1 ${person.Wednesday?.roted[0] === "HOLIDAY" ? "bg-indigo-300" : "bg-orange-300"} rounded-lg text-center shadow-md`} title="Set ROTA">
          {person.Wednesday?.roted.map((time, indexNumber) => (
            <p key={crypto.randomUUID()}>{time}</p>
          ))}
        </div>

        {/* clocked time */}
        <div className={`${person.Wednesday ? "grid" : "hidden"} ${person.Wednesday?.clocked.length > 0 ? "grid" : "hidden"} grid-cols-1 py-1 bg-blue-300 rounded-lg text-center shadow-md `}>
          {person.Wednesday?.clocked.map((clock, indexNumber) => {
            if (indexNumber % 2 == 0)
              return (
                <p title="Actual Clock In/Out ROTA" key={crypto.randomUUID()}>
                  <span>{clock}</span>
                  <span> - </span>
                  <span>{person.Wednesday?.clocked[indexNumber + 1] || "?"}</span>
                </p>
              );
          })}
        </div>
        <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
      </div>

      <div className="dayLogThursday flex flex-col gap-2">
        {/* roted time */}
        <div onClick={() => editTimes(person.Thursday.roted, "Thursday")} className={`${person.Thursday ? "" : "hidden"} ${person.Thursday?.roted.length > 0 ? "" : "hidden"} py-1 ${person.Thursday?.roted[0] === "HOLIDAY" ? "bg-indigo-300" : "bg-orange-300"} rounded-lg text-center shadow-md`} title="Set ROTA">
          {person.Thursday?.roted.map((time, indexNumber) => (
            <p key={crypto.randomUUID()}>{time}</p>
          ))}
        </div>

        {/* clocked time */}
        <div className={`${person.Thursday ? "grid" : "hidden"} ${person.Thursday?.clocked.length > 0 ? "grid" : "hidden"} grid-cols-1 py-1 bg-blue-300 rounded-lg text-center shadow-md `}>
          {person.Thursday?.clocked.map((clock, indexNumber) => {
            if (indexNumber % 2 == 0)
              return (
                <p title="Actual Clock In/Out ROTA" key={crypto.randomUUID()}>
                  <span>{clock}</span>
                  <span> - </span>
                  <span>{person.Thursday?.clocked[indexNumber + 1] || "?"}</span>
                </p>
              );
          })}
        </div>
        <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
      </div>

      <div className="dayLogFriday flex flex-col gap-2">
        {/* roted time */}
        <div onClick={() => editTimes(person.Friday.roted, "Friday")} className={`${person.Friday ? "" : "hidden"} ${person.Friday?.roted.length > 0 ? "" : "hidden"} py-1 ${person.Friday?.roted[0] === "HOLIDAY" ? "bg-indigo-300" : "bg-orange-300"} rounded-lg text-center shadow-md`} title="Set ROTA">
          {person.Friday?.roted.map((time, indexNumber) => (
            <p key={crypto.randomUUID()}>{time}</p>
          ))}
        </div>

        {/* clocked time */}
        <div className={`${person.Friday ? "grid" : "hidden"} ${person.Friday?.clocked.length > 0 ? "grid" : "hidden"} grid-cols-1 py-1 bg-blue-300 rounded-lg text-center shadow-md `}>
          {person.Friday?.clocked.map((clock, indexNumber) => {
            if (indexNumber % 2 == 0)
              return (
                <p title="Actual Clock In/Out ROTA" key={crypto.randomUUID()}>
                  <span>{clock}</span>
                  <span> - </span>
                  <span>{person.Friday?.clocked[indexNumber + 1] || "?"}</span>
                </p>
              );
          })}
        </div>
        <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
      </div>

      <div className="dayLogSaturday flex flex-col gap-2">
        {/* roted time */}
        <div onClick={() => editTimes(person.Saturday.roted, "Saturday")} className={`${person.Saturday ? "" : "hidden"} ${person.Saturday?.roted.length > 0 ? "" : "hidden"} py-1 ${person.Saturday?.roted[0] === "HOLIDAY" ? "bg-indigo-300" : "bg-orange-300"}  rounded-lg text-center shadow-md`} title="Set ROTA">
          {person.Saturday?.roted.map((time, indexNumber) => (
            <p key={crypto.randomUUID()}>{time}</p>
          ))}
        </div>

        {/* clocked time */}
        <div className={`${person.Saturday ? "grid" : "hidden"} ${person.Saturday?.clocked.length > 0 ? "grid" : "hidden"} grid-cols-1 py-1 bg-blue-300 rounded-lg text-center shadow-md `}>
          {person.Saturday?.clocked.map((clock, indexNumber) => {
            if (indexNumber % 2 == 0)
              return (
                <p title="Actual Clock In/Out ROTA" key={crypto.randomUUID()}>
                  <span>{clock}</span>
                  <span> - </span>
                  <span>{person.Saturday?.clocked[indexNumber + 1] || "?"}</span>
                </p>
              );
          })}
        </div>
        <p className=" py-1 bg-gray-300 rounded-lg text-center shadow-md active:shadow-inner border-b-2 border-b-gray-400 active:border-b-0 active:border-t-2 active:border-t-gray-400 transition">+</p>
      </div>
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
