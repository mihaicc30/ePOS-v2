import React, { useState, useEffect, useRef } from "react";
import { getStaffMembers, savePosUser, handleRemove } from "../../utils/DataTools";
import { AiOutlineUser } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AdminStaff = () => {
  const [searchStaff, setSearchStaff] = useState("");
  const searchInputRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [modalAddStaff, setModalAddStaff] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [staff, setStaff] = useState([]);
  const [errors, setErrors] = useState([]);
  const [tempUser, setTempUser] = useState({
    displayName: "",
    position: "",
    venueID: localStorage.getItem("venueID"),
    team: "",
    worktype: "",
    courses: [],
    email: "",
    autoStore: false,
    darkMode: false,
    lefty: false,
    pin: "",
    fingerprint: "",
    isAdmin: false,
    phone: "",
  });

  const [staffCount, setStaffCount] = useState({ new: 0, total: 0 });
  const [staffTraining, setStaffTraining] = useState({ completed: 0, total: 0 });
  const openPopup = (user) => {
    setModalData(user);
    setModal(!modal);
  };

  useEffect(() => {}, [searchStaff]);

  useEffect(() => {
    // new members widget
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds

    const staffWithinOneMonth = staff.filter((staff) => {
      const staffDate = new Date(staff.date);
      return staffDate >= oneMonthAgo && staffDate <= now;
    });
    setStaffCount((prev) => {
      return {
        ...prev,
        total: staff.length,
        new: staffWithinOneMonth.length,
      };
    });
    const staffTraining = staff.reduce(
      (acc, staff) => {
        staff.courses.forEach((course) => {
          acc.total++;
          if (course.status === "Passed!") {
            acc.completed++;
          }
        });
        return acc;
      },
      { completed: 0, total: 0 }
    );

    setStaffTraining(staffTraining);
  }, [staff]);

  useEffect(() => {
    (async () => {
      setStaff(await getStaffMembers());
    })();
  }, []);

  const handleStaffRemoval = async (data) => {
    const query = await handleRemove(data);

    if (query.message === "POS User deleted.") {
      setModal(!modal);
      const updatedStaff = staff.filter((user) => user._id !== data);
      setStaff(updatedStaff);

      toast.success(`User has been deleted.`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(`${query.message}`, {
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

  const handleAddNewStaff = async () => {
    setErrors([<AiOutlineLoading3Quarters className="animate-spin mx-auto text-5xl" />]);
    let errors = [];
    let testingString = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!tempUser.displayName) {
      errors.push("Full Name required.");
    } else if (tempUser.displayName.length < 6) {
      errors.push("Full Name too short.");
    }

    if (!tempUser.email) {
      errors.push("Email required.");
    } else if (!testingString.test(tempUser.email)) {
      errors.push("Email invalid.");
    }

    if (!tempUser.pin) {
      errors.push("Pin required.");
    } else if (tempUser.pin.length < 3) {
      errors.push("Pin too short.");
    }

    if (!tempUser.phone) {
      errors.push("Phone required.");
    } else if (tempUser.phone.length < 11) {
      errors.push("Phone number too short.");
    }

    if (!tempUser.position) {
      errors.push("Role required.");
    } else if (tempUser.position.length < 2) {
      errors.push("Role name too short.");
    }
    if (!tempUser.team) {
      errors.push("Team required.");
    } else if (tempUser.team.length < 3) {
      errors.push("Team name too short.");
    }

    if (!tempUser.worktype) {
      errors.push("Type of Contract required.");
    } else if (tempUser.worktype.length < 3) {
      errors.push("Type of Contract name too short.");
    }
    if (errors.length > 0) {
      setErrors([]);
      errors.map((err, i) => setErrors((prevErrors) => [...prevErrors, err]));
    } else {
      const query = await savePosUser(tempUser);
      if (query.message === "POS User saved.") {
        setErrors([]);
        setModalAddStaff(!modalAddStaff);
        setStaff((prev) => [...prev, query.user]);
        toast.success(`User has been saved.`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      } else {
        setErrors([query.message]);
        toast.error(`${query.message}`, {
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
    }
  };

  return (
    <div className="flex flex-col overflow-y-auto relative">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      {modalAddStaff && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModalAddStaff(!modalAddStaff) : null)}>
          <div className="fixed right-0 left-[25%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1" onClick={() => setModalAddStaff(!modalAddStaff)}>
              ◀ Cancel
            </button>

            <AiOutlineUser className="my-12 text-5xl" />

            <div className="overflow-auto px-2 w-[86%] gap-4 ml-auto pr-4 relative grid grid-cols-6">
              <div className="flex my-3 relative flex-col col-span-4">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">User Name</span>
                <input
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  type="text"
                  className="p-4 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl"
                  defaultValue={tempUser.displayName}
                  placeholder="Name: John Doe.."
                />
              </div>
              <div className="flex my-3 relative flex-col col-span-2">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">User Pin</span>
                <input
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      pin: e.target.value,
                    }))
                  }
                  type="text"
                  className="p-4 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl"
                  defaultValue={tempUser.pin}
                  placeholder="Pin: 123..."
                />
              </div>

              <div className="flex my-1 relative flex-col col-span-3">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">User Email</span>
                <input
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  type="text"
                  className="p-4 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl"
                  defaultValue={tempUser.email}
                  placeholder="Email: JohnDoe@email.com.."
                />
              </div>

              <div className="flex my-1 relative flex-col col-span-3">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">User Phone</span>
                <input
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  type="text"
                  className="p-4 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl"
                  defaultValue={tempUser.phone}
                  placeholder="Phone: 07712123123.."
                />
              </div>

              <div className="flex my-1 relative flex-col col-span-2">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Role</span>
                <input
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  type="text"
                  className="p-4 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl"
                  defaultValue={tempUser.role}
                  placeholder="Role: Waiter, Chef.."
                />
              </div>

              <div className="flex my-1 relative flex-col col-span-2">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Team</span>
                <input
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      team: e.target.value,
                    }))
                  }
                  type="text"
                  className="p-4 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl"
                  defaultValue={tempUser.team}
                  placeholder="Team: Management, Chef, Staff.."
                />
              </div>

              <div className="flex my-1 relative flex-col col-span-2">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Type of Contract</span>
                <input
                  onChange={(e) =>
                    setTempUser((prev) => ({
                      ...prev,
                      worktype: e.target.value,
                    }))
                  }
                  type="text"
                  className="p-4 text-lg border-y-2 border-y-black/30 shadow-lg rounded-xl"
                  defaultValue={tempUser.worktype}
                  placeholder="Type: Full Time, Part Time.."
                />
              </div>

              {errors && errors.length > 0 && (
                <>
                  <div className="flex my-1 relative flex-col col-span-6 mx-auto border-l-4 border-l-red-400 text-start">
                    {errors.map((err, index) => {
                      return (
                        <span className=" bg-white rounded-lg pl-4" key={index + "err"}>
                          {err}
                        </span>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="my-3 relative col-span-6 grid grid-cols-3 gap-4 w-[100%]">
                <span></span>
                <button onClick={handleAddNewStaff} className="bg-orange-400 p-2 rounded-lg shadow-md border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                  Submit ▶
                </button>
              </div>
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
            <div className="overflow-auto px-4 grid grid-cols-2 gap-4 ml-auto w-[86%]  pt-20">
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="flex flex-col text-xl text-start row-span-4">
                  <p className="font-bold border-b-[1px]">{modalData.displayName}</p>
                  <p>{modalData.position}</p>
                  <p>{modalData.team}</p>
                  <p>{modalData.worktype}</p>
                  <p>{modalData.phone}</p>
                  <p>{modalData.email}</p>
                </div>
                <button onClick={() => handleStaffRemoval(modalData._id)} className="bg-red-400 p-2 rounded-lg shadow-md border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                  Remove
                </button>
                <AiOutlineUser className="text-[10rem] my-4 rounded-full aspect-square row-span-4 mx-auto border-2 shadow-lg p-1" />
                {/* <img src={"../assets/drinks.jpg"} className="h-[160px] w-[auto] rounded-full aspect-square row-span-4 mx-auto" /> */}
                <a href={`mailto:${modalData.email}?subject=Query&amp;body=Your message...`} className="bg-orange-300 p-2 rounded-lg shadow-md border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                  Email
                </a>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4">
                <p className="text-xl border-b-2 col-span-2">
                  <span className="font-bold">{modalData.courses.filter((course) => course.status === "Passed!").length}</span>/<span>{modalData.courses.length}</span> Training
                </p>

                <div onClick={() => console.log(`dev**to open modal to add courses for ${modalData.displayName}`)} className="trainingCard bg-gray-50 flex justify-center items-center text-5xl shadow-md p-2 transition active:shadow-inner active:border-2 active:border-black/50 active:border-b-0">
                  +
                </div>

                {modalData.courses.map((course, index) => {
                  return (
                    <div className={`trainingCard ${course.examStarted < 1 && "bg-yellow-100"} ${course.progress === 100 && course.status !== "Passed!" && "bg-red-100"} ${course.status === "Passed!" && "bg-green-100"} shadow-md p-2`} key={crypto.randomUUID()}>
                      <p className="font-bold border-b-[1px] border-b-gray-500">{course.courseName}</p>
                      <p>Progress: {course.progress}%</p>
                      <p>Exam Started: {course.examStarted} times</p>
                      <p>Mark: {course.mark}%</p>
                      <p>{course.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="text-xl font-bold p-2 underline relative">
        Staff Management <span className=" absolute text-xs font-light top-2">*in future development</span>
      </p>

      <div className="relative w-[100%] flex gap-4 flex-nowrap p-1">
        <button onClick={() => setModalAddStaff(!modalAddStaff)} className={`bg-orange-300 py-2 px-2 rounded-lg shadow-xl border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0 whitespace-nowrap`}>
          Add New
        </button>
        <div className="relative flex w-[100%]">
          <input list="stafflist" ref={searchInputRef} name="venuesearchinput" type="text" placeholder="Staff Name..." className="w-[98%] pl-10 pr-16 rounded" value={searchStaff} onChange={(e) => setSearchStaff(e.target.value)} />
          <span className="absolute top-[18px] left-[10px] -translate-y-[10px]">🔍</span>
          <button onClick={() => setSearchStaff("")} className={`absolute top-[8px] right-[26px] -translate-y-[10px] ${searchStaff ? "" : "hidden"} border-2 p-2 shadow-lg`}>
            ✖
          </button>

          <datalist id="stafflist">
            {staff &&
              staff.map((staffi, index) => {
                return (
                  <option key={"gx" + crypto.randomUUID()} value={staffi.displayName}>
                    {staffi.displayName}
                  </option>
                );
              })}
          </datalist>
        </div>
      </div>
      <div className="flex flex-col w-[100%] gap-2 mt-4 overflow-y-scroll ">
        <p className="text-xl font-bold p-2">General Info</p>
        {/* stats start*/}
        <div className="flex-1 flex flex-wrap">
          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center flex-col items-center min-w-[200px] min-h-[120px]">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width={64} height={64} viewBox="0 0 512 512">
                <circle
                  cx={256}
                  cy={256}
                  r={256}
                  style={{
                    fill: "#e6e6e6",
                  }}
                />
                <path
                  d="M117.82 364.108c-6.472-9.968-3.64-23.296 6.328-29.768l16.044-10.416c-9.968 6.476-23.296 3.64-29.768-6.328-6.472-9.964-3.64-23.288 6.328-29.764l12.032-7.812.02.028c21.548-13.98 64.964-42.228 74.176-48.212 17.928-11.644 43.088-25.788 39.112-45.712 48.78-35.876 65.66-2.284 97.236-2.916l16.244-10.548 61.212 94.252-16.428 10.672c7.916 19.508-13.8 40.32-21.744 45.476-7.696 5-85.46 55.5-123.976 80.516-9.884 6.416-17.184 11.156-20.052 13.016l-12.032 7.82-.08-.116c-9.672 4.86-21.656 1.772-27.688-7.516s-3.976-21.488 4.4-28.344l-.076-.116-14.04 9.116c-9.968 6.468-23.296 3.64-29.768-6.328-6.476-9.968-3.64-23.292 6.328-29.768l-14.036 9.116c-9.972 6.452-23.3 3.624-29.772-6.348z"
                  style={{
                    fill: "#f4c395",
                  }}
                />
                <path
                  d="m379.192 287.824-12.032-7.812-.02.028c-21.548-13.976-64.964-42.228-74.18-48.212-17.924-11.644-43.084-25.788-39.108-45.712a139.7 139.7 0 0 0-5.88-4.068 131.703 131.703 0 0 0-5.88 4.068c3.976 19.924-21.184 34.072-39.112 45.712-9.212 5.984-52.628 34.236-74.176 48.212l-.02-.028-12.032 7.812c-9.84 6.396-12.712 19.456-6.552 29.384 2.752 2.636 5.308 4.656 7.136 5.84.908.588 2.82 1.832 5.496 3.572 5.704 1.552 12.012.78 17.364-2.696l-10.756 6.984c25.04 16.26 81.028 52.62 111.876 72.656 2.384 1.548 4.604 2.984 6.66 4.32 2.06-1.336 4.28-2.772 6.664-4.32 30.844-20.036 86.836-56.396 111.876-72.656l-10.756-6.984c5.352 3.476 11.664 4.244 17.368 2.688 2.672-1.736 4.584-2.972 5.492-3.568 1.828-1.184 4.384-3.204 7.132-5.836 6.152-9.928 3.28-22.988-6.56-29.384z"
                  style={{
                    fill: "#e6d9b8",
                  }}
                />
                <path
                  d="M380.415 155.569h21.519v121.942h-21.519z"
                  style={{
                    fill: "#a6a6a6",
                  }}
                  transform="scale(-1) rotate(-32.992 -731.242 1320.973)"
                />
                <path
                  d="m360.484 149.496 79.444 122.324 70.284-45.644c-5.964-51.408-27.148-98.148-58.94-135.636l-90.788 58.956z"
                  style={{
                    fill: "#e1710e",
                  }}
                />
                <path
                  d="M368.556 364.108c6.472-9.968 3.64-23.296-6.328-29.768l-16.044-10.416c9.964 6.476 23.292 3.64 29.768-6.328 6.468-9.964 3.64-23.288-6.328-29.764l-12.032-7.812-.016.028c-21.552-13.98-64.968-42.228-74.184-48.212-17.924-11.644-43.088-25.788-39.112-45.712-48.78-35.876-86.164-15.624-97.236-2.916L130.8 172.66l-61.204 94.248 16.428 10.672c-7.912 19.508 13.8 40.32 21.74 45.476 7.696 5 85.46 55.5 123.976 80.516 9.884 6.416 17.184 11.156 20.052 13.016l12.028 7.82.08-.116c9.672 4.86 21.656 1.772 27.688-7.516s3.976-21.488-4.4-28.344l.08-.116 14.04 9.116c9.968 6.468 23.296 3.64 29.764-6.328 6.472-9.968 3.64-23.292-6.328-29.768l14.04 9.116c9.972 6.456 23.3 3.628 29.772-6.344z"
                  style={{
                    fill: "#f5e8cc",
                  }}
                />
                <path
                  d="m267.908 420.272-.076.116-12.032-7.812c-2.868-1.86-10.168-6.604-20.052-13.024-38.516-25.012-116.28-75.512-123.976-80.512-7.94-5.152-29.652-25.964-21.74-45.48l-16.428-10.664 58.192-89.608-.988-.64L69.6 266.9l16.428 10.672c-7.912 19.508 13.8 40.32 21.74 45.476 7.696 5 85.46 55.5 123.976 80.516 9.884 6.416 17.184 11.156 20.052 13.016l12.032 7.82.076-.116c9.108 4.576 20.208 2.036 26.512-6.024-6.4 4.776-15.12 5.732-22.508 2.012z"
                  style={{
                    fill: "#d5cdb9",
                  }}
                />
                <path
                  d="m305.304 393.416-84.16-54.088c-2.616-1.012-5.68 1.364-2.916 4.084l83.084 54c9.46 6.148 21.888 3.82 28.664-4.952-7.024 5.312-16.86 6.028-24.672.956zM342.936 366.664l-107.8-70.544c-2.616-1.012-5.68 1.364-2.916 4.084l106.72 70.456c9.464 6.148 21.892 3.82 28.672-4.956-7.036 5.32-16.86 6.032-24.676.96zM350.184 320.288l-82.968-54.696c-2.612-1.008-5.68 1.368-2.916 4.088l81.888 54.604c9.464 6.148 21.888 3.82 28.668-4.956-7.028 5.32-16.86 6.032-24.672.96z"
                  style={{
                    fill: "#d5cdb9",
                  }}
                />
                <path
                  d="M84.455 155.501h21.52v121.948h-21.52z"
                  style={{
                    fill: "#a6a6a6",
                  }}
                  transform="rotate(32.997 95.214 216.476)"
                />
                <path
                  d="m.404 241.916 46.048 29.904 79.436-122.324-73.956-48.028C22.008 140.92 3.256 189.296.404 241.916z"
                  style={{
                    fill: "#406a80",
                  }}
                />
                <path
                  d="M246.176 161.116c-14.644-.3-55.592 8.668-65.456 7.772-9.864-.9-35.484 41.96-44.28 52.26-.056.068-.104.148-.16.216-.232.248-.46.448-.692.72-8.164 9.524-22.596 24.568-15.764 35.088 4.528 6.972 12.236 10.608 19.98 10.304l.016.044c.184-.016.384-.04.58-.06a22.717 22.717 0 0 0 7.228-1.712c12.672-4.456 32.568-18.428 54.016-56.512 20.324 15.544 80.1 36.464 136.588-26.6-24.508-12.852-77.408-21.22-92.056-21.52z"
                  style={{
                    fill: "#f4c395",
                  }}
                />
                <path
                  d="m276.84 392.668-6.268-4.076a1.502 1.502 0 0 0-2.068.44l-11.396 17.552a1.498 1.498 0 0 0 .44 2.068l6.264 4.076c5.54 3.592 12.944 2.024 16.54-3.52 3.6-5.54 2.024-12.944-3.512-16.54zM312.708 363.976l-6.268-4.072a1.5 1.5 0 0 0-2.068.436l-11.396 17.548a1.506 1.506 0 0 0 .436 2.072l6.268 4.068c5.536 3.596 12.94 2.028 16.54-3.512 3.592-5.54 2.024-12.944-3.512-16.54zM350.96 337.676l-6.264-4.076a1.51 1.51 0 0 0-2.072.436l-11.396 17.548a1.501 1.501 0 0 0 .44 2.072l6.264 4.072c5.54 3.596 12.94 2.024 16.54-3.516 3.6-5.536 2.028-12.94-3.512-16.536zM362.92 297.028l-6.264-4.072a1.508 1.508 0 0 0-2.072.432l-11.396 17.548a1.504 1.504 0 0 0 .44 2.072l6.264 4.072c5.54 3.596 12.94 2.024 16.54-3.516 3.6-5.536 2.02-12.94-3.512-16.536z"
                  style={{
                    fill: "#fff",
                  }}
                />
              </svg>
            </span>
            <p>
              <span className="text-xl font-bold">{staffCount.new}</span>/<span className="text-xl">{staffCount.total}</span> New Members in the last month
            </p>
          </div>

          <div className="widget flex-1 p-2 m-1 shadow-xl flex justify-center flex-col items-center min-w-[200px] min-h-[120px]">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" id="Layer_1" width={64} height={64} fill="#000" viewBox="0 0 512 512">
                <g id="SVGRepo_iconCarrier">
                  <style>{".st0{fill:#d3d8d9}.st1{fill:#ededed}.st2{fill:#a8b1b3}.st3{fill:#fff}.st4{fill:#fb8a8a}.st5{fill:#fcb1b1}.st6{fill:#f96363}.st10{fill:#fee8b3}.st22{fill:#333}"}</style>
                  <path d="M320 307.8h30.5v128.8H320zM485.6 436.6h-30.4l-60-128.8h30.5zM275.3 307.8l-59.9 128.8h-30.5l60-128.8z" className="st0" />
                  <path d="M320 307.8h30.5v21.8H320zM435.8 329.6h-30.4l-10.2-21.8h30.5z" className="st1" />
                  <path d="M485.6 436.6h-30.5L445 414.8h30.5zM184.9 436.6h30.5l10.2-21.8h-30.5z" className="st2" />
                  <path d="m275.3 307.8-10.1 21.8h-30.5l10.2-21.8z" className="st1" />
                  <path d="M320 414.8h30.5v21.8H320z" className="st2" />
                  <path d="M178.6 71.7h313.3v201.8H178.6z" className="st3" />
                  <path d="M512 43.4v22.3c0 3.3-2.7 6-6 6H164.5c-3.3 0-6-2.7-6-6V43.4c0-3.3 2.7-6 6-6H506c3.3 0 6 2.7 6 6z" className="st4" />
                  <path d="M512 43.4v10.9c0-3.3-2.7-6-6-6H164.5c-3.3 0-6 2.7-6 6V43.4c0-3.3 2.7-6 6-6H506c3.3 0 6 2.7 6 6z" className="st5" />
                  <path d="M512 54.8v10.9c0 3.3-2.7 6-6 6H164.5c-3.3 0-6-2.7-6-6V54.8c0 3.3 2.7 6 6 6H506c3.3 0 6-2.7 6-6z" className="st6" />
                  <path d="M512 279.5v22.3c0 3.3-2.7 6-6 6H164.5c-3.3 0-6-2.7-6-6v-22.3c0-3.3 2.7-6 6-6H506c3.3 0 6 2.7 6 6z" className="st4" />
                  <path d="M512 279.5v10.9c0-3.3-2.7-6-6-6H164.5c-3.3 0-6 2.7-6 6v-10.9c0-3.3 2.7-6 6-6H506c3.3 0 6 2.7 6 6z" className="st5" />
                  <path d="M512 290.9v10.9c0 3.3-2.7 6-6 6H164.5c-3.3 0-6-2.7-6-6v-10.9c0 3.3 2.7 6 6 6H506c3.3-.1 6-2.7 6-6z" className="st6" />
                  <path
                    d="M0 241.1v81.6c0 14.2 11.5 25.7 25.7 25.7H134V229.7h90c5.9 0 11.3-2.4 15.2-6.3 3.9-3.9 6.3-9.3 6.3-15.2 0-11.9-9.6-21.5-21.5-21.5H54.4C24.3 186.7 0 211.1 0 241.1z"
                    style={{
                      fill: "#ff881a",
                    }}
                  />
                  <path
                    d="M0 241.1V262c0-30 24.3-54.4 54.4-54.4H224c8.1 0 15.1 4.5 18.7 11.1 1.8-3.1 2.8-6.7 2.8-10.5 0-11.9-9.6-21.5-21.5-21.5H54.4c-30 0-54.4 24.4-54.4 54.4z"
                    style={{
                      fill: "#f60",
                    }}
                  />
                  <path
                    d="M0 301.7v21c0 14.2 11.5 25.7 25.7 25.7h10.5v-21H25.7C11.5 327.4 0 315.9 0 301.7z"
                    style={{
                      fill: "#ffcb70",
                    }}
                  />
                  <path d="M36.2 345.6v105.5c0 13 10.5 23.5 23.5 23.5h50.8c13 0 23.5-10.5 23.5-23.5V345.6H36.2z" className="st1" />
                  <path d="M36.2 429.6V451c0 13 10.5 23.5 23.5 23.5h50.8c13 0 23.5-10.5 23.5-23.5v-21.5c0 13-10.5 23.5-23.5 23.5H59.7c-13 .1-23.5-10.4-23.5-23.4z" className="st0" />
                  <path d="m48.6 187 36.5 75.1 36.5-75.1z" className="st3" />
                  <path d="M46.7 95.3v65.2c0 19.7 16 35.7 35.7 35.7 19.7 0 35.7-16 35.7-35.7V95.3H46.7z" className="st10" />
                  <path
                    d="M46.7 95.3H118v43.1H46.7z"
                    style={{
                      fill: "#fff4d9",
                    }}
                  />
                  <path
                    d="M147.6 79 118 123.2H46.7V95.7c0-9.2 7.5-16.7 16.7-16.7h84.2z"
                    style={{
                      fill: "#516468",
                    }}
                  />
                  <path
                    d="m147.6 79-9.4 14H63.4c-9.2 0-16.7 7.6-16.7 16.8V95.7c0-9.2 7.5-16.7 16.7-16.7h84.2z"
                    style={{
                      fill: "#7c8b8d",
                    }}
                  />
                  <path
                    d="M423.8 95.3h38v154.6h-38z"
                    style={{
                      fill: "#7ad1f9",
                    }}
                  />
                  <path
                    d="M349.7 125.8h38v124.1h-38z"
                    style={{
                      fill: "#7bde9e",
                    }}
                  />
                  <path
                    d="M275.7 156.3h38v93.6h-38z"
                    style={{
                      fill: "#fddd8d",
                    }}
                  />
                  <path
                    d="M423.8 95.3h38v19.1h-38z"
                    style={{
                      fill: "#a6e1fb",
                    }}
                  />
                  <path
                    d="M349.7 230.8h38v19.1h-38z"
                    style={{
                      fill: "#50d27e",
                    }}
                  />
                  <path
                    d="M275.7 230.8h38v19.1h-38z"
                    style={{
                      fill: "#fdd267",
                    }}
                  />
                  <path
                    d="M423.8 230.8h38v19.1h-38z"
                    style={{
                      fill: "#4cc3f7",
                    }}
                  />
                  <path
                    d="M349.7 125.8h38v19.1h-38z"
                    style={{
                      fill: "#a7e9bf",
                    }}
                  />
                  <path d="M275.7 156.3h38v19.1h-38z" className="st10" />
                  <path d="M461.8 254h-38c-2.2 0-4.1-1.8-4.1-4.1V95.3c0-2.2 1.8-4.1 4.1-4.1h38c2.2 0 4.1 1.8 4.1 4.1v154.6c0 2.3-1.9 4.1-4.1 4.1zm-33.9-8.1h29.9V99.3h-29.9v146.6zM387.7 254h-38c-2.2 0-4.1-1.8-4.1-4.1V125.8c0-2.2 1.8-4.1 4.1-4.1h38c2.2 0 4.1 1.8 4.1 4.1v124.1c0 2.3-1.8 4.1-4.1 4.1zm-33.9-8.1h29.9v-116h-29.9v116zM313.6 254h-38c-2.2 0-4.1-1.8-4.1-4.1v-93.6c0-2.2 1.8-4.1 4.1-4.1h38c2.2 0 4.1 1.8 4.1 4.1v93.6c0 2.3-1.8 4.1-4.1 4.1zm-33.9-8.1h29.8v-85.5h-29.8v85.5z" className="st22" />
                  <path
                    d="M502.1 78.6c5.5 0 9.9-4.4 9.9-9.9v-22c0-5.5-4.4-9.9-9.9-9.9H166c-5.4 0-9.9 4.4-9.9 9.9v22c0 5.4 4.4 9.9 9.9 9.9h9.8v105.2h-58.4c4.2-6.2 6.7-13.8 6.7-21.8v-35.5L152.6 84c.8-1.2.9-2.8.2-4.1-.7-1.3-2.1-2.1-3.5-2.1H66.4c-11 0-19.9 8.7-20.4 19.6 0 .2-.1.3-.1.5V162c0 8.2 2.6 15.8 6.9 22.1C23.3 186.5 0 211.2 0 241.4v80.3C0 337.9 13.2 351 29.3 351h6.4v97c0 15 12.2 27.1 27.1 27.1h50c14.9 0 27.1-12.2 27.1-27.1V234.1h35.9v35.1H166c-5.4 0-9.9 4.4-9.9 9.9v22c0 5.4 4.4 9.8 9.9 9.8h72.8L182.4 432c-.6 1.2-.5 2.7.3 3.8.7 1.2 2 1.9 3.4 1.9h30c1.6 0 3-.9 3.6-2.3L277.6 311H315v122.8c0 2.2 1.8 4 4 4h30c2.2 0 4-1.8 4-4V311h37.4l58 124.5c.6 1.4 2 2.3 3.6 2.3h30c1.4 0 2.6-.7 3.4-1.9.7-1.1.8-2.6.2-3.8L429.3 311h72.8c5.5 0 9.9-4.4 9.9-9.8v-22c0-5.4-4.4-9.9-9.9-9.9h-9.8V78.6h9.8zM53.9 98.2c0-6.9 5.6-12.5 12.5-12.5h75.4L118 121.3H53.9V98.2zm0 31.1h62.2V162c0 17.2-14 31.1-31.1 31.1-17.2 0-31.1-14-31.1-31.1v-32.7zm63.4 62.7-29.5 60.8L58.2 192h1.9c6.8 5.6 15.4 9 24.9 9 9.5 0 18.1-3.4 24.9-9h7.4zm-88 150.9c-11.7 0-21.3-9.5-21.3-21.3v-80.3c0-24.6 18-45 41.5-48.8l34.3 70.4v80H43.6v-91.7c0-2.2-1.8-4-4-4s-4 1.8-4 4v91.7h-6.3zM43.6 448v-97.1h40.1v116.2h-21c-10.5.1-19.1-8.5-19.1-19.1zm69.2 19.2h-21V350.9h40.1V448c0 10.6-8.6 19.2-19.1 19.2zm23.1-241c-2.2 0-4 1.8-4 4V343H91.8v-80.1l34.5-71h98.2c9.5 0 17.2 7.7 17.2 17.2 0 9.4-7.6 17.2-17.2 17.2h-88.6zm88.6-42.4h-40.7V78.6h300.5v190.6H183.8v-35.1h40.7c14 0 25.2-11.4 25.2-25.2 0-13.8-11.3-25.1-25.2-25.1zm-11 246h-21.2L247.6 311h21.2l-55.3 118.8zm131.5 0h-22V311h22v118.8zm130.8 0h-21.2L399.3 311h21.2l55.3 118.8zm26.3-152.6c1.1 0 1.9.8 1.9 1.9v22c0 1-.8 1.8-1.9 1.8H166c-1 0-1.9-.8-1.9-1.8v-22c0-1 .8-1.9 1.9-1.9h336.1zM166 70.6c-1 0-1.9-.8-1.9-1.9v-22c0-1.1.8-1.9 1.9-1.9h336.1c1.1 0 1.9.8 1.9 1.9v22c0 1-.8 1.9-1.9 1.9H166z"
                    className="st22"
                  />
                </g>
              </svg>
            </span>
            <p>
              <span className="text-xl font-bold">{staffTraining.completed}</span>/<span className="text-xl">{staffTraining.total}</span> Overall Staff Training Completed
            </p>
          </div>
        </div>
        {/* stats end*/}

        <div className="staffList grid grid-cols-4 w-[100%] gap-4 p-1">
          {staff.map((staffMember, index) => {
            if (staffMember.displayName.split(" ").some((item) => item.toLowerCase().includes(searchStaff.toLowerCase())) || searchStaff === "")
              return (
                <div className="staffCard shadow-xl flex flex-col p-2" key={crypto.randomUUID()}>
                  {/* <img src={`https://randomuser.me/api/portraits/men/1.jpg`} className="h-[100px] rounded-full aspect-square mx-auto" /> temp disabled */}
                  <AiOutlineUser className="h-[100px] rounded-full aspect-square mx-auto text-5xl" />
                  <div className="flex flex-col text-xl text-center grow">
                    <p className="font-bold">{staffMember.displayName}</p>
                    <span className=" border-b-[1px] grow"></span>
                    <p>{staffMember.position}</p>
                    <p>{staffMember.team}</p>
                    <p>{staffMember.worktype}</p>
                  </div>
                  <button onClick={() => openPopup(staffMember)} className="my-4 col-span-2 w-[100%] bg-orange-400 p-2 rounded-lg shadow-md border-b-2 border-b-black active:shadow-inner active:border-t-2 active:border-t-black active:border-b-0">
                    Info ▶
                  </button>
                </div>
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminStaff;
