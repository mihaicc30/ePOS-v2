import React, { useState, useEffect, useRef } from "react";
import "./Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db, auth, logInWithEmailAndPassword, signInWithGoogle, signInWithPopup, signInWithFacebook } from "../../firebase/config.jsx";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { FaCogs } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { authUser, setVenue } from "../../utils/authUser";
import { handleClocked } from "../../utils/DataTools";

const Auth = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const fp = useRef(null);
  const pinInput = useRef(null);
  const [userTable, setUserTable] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [clockedLoading, setClockedLoading] = useState(false);

  useEffect(() => {
    async function getUserTable() {
      try {
        const query = await fetch(`http://localhost:3000/posusers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            v: import.meta.env.VITE_G,
          }),
        });
        const response = await query.json();
        console.log("Receied pos users.", new Date().toUTCString());
        setUserTable(response);
      } catch (error) {
        console.log(error.message);
      }
    }
    getUserTable();
  }, []);

  useEffect(() => {
    if (user) navigate("/Tables");
  }, [user]);

  const [pin, setPin] = useState({
    pin: "",
  });

  const handleBackspace = () => {
    setPin((prevPin) => ({
      ...prevPin,
      pin: prevPin.pin.slice(0, -1),
    }));
  };

  const handleClear = () => {
    setPin({ pin: "" });
  };

  const handleNumber = (name) => {
    if (isNaN(name)) return;

    setPin((prevPin) => ({
      ...prevPin,
      pin: prevPin.pin + name,
    }));
  };

  const handlePinInput = (e) => {
    const { name, value } = e.target;

    if (value) {
      handleNumber(value);
    } else {
      switch (name) {
        case "b":
          handleBackspace();
          break;
        case "c":
          handleClear();
          break;
        default:
          handleNumber(name);
          break;
      }
    }
  };

  const checkPin = () => {
    const foundPin = userTable.find((userpin) => userpin.pin === pin.pin);
    if (foundPin && pin.pin.length >= 3) {
      authUser(foundPin);
      if (foundPin.isAdmin == 1) {
        navigate("/Admin");
      } else if (foundPin.isAdmin == 0) {
        navigate("/Tables");
      }
    } else if (!foundPin) {
    }
    setPin({ pin: "" });
  };

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      //mimic fingerprint checking
      if (isScanning) {
        const fpRef = fp.current;
        fpRef.classList.remove("animate-shake");
        console.log("Loggin into test user.");
        authUser(userTable[1]);
        setVenue(setVenue, userTable[1]);
        navigate("/Menu");
      } else {
        // mimic fingerprint error
        const fpRef = fp.current;
        fpRef?.classList.add("animate-shake");
        setTimeout(() => {
          fpRef?.classList.remove("animate-shake");
        }, 1500);
      }
      setIsScanning(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isScanning]);

  const handleScanStart = () => {
    setIsScanning(true);
  };

  const handleTouchStart = () => {
    setIsScanning(true);
    handleScanStart();
  };

  const handleTouchEnd = () => {
    setIsScanning(false);
  };

  const handleClock = async () => {
    setClockedLoading(true);
    const foundPin = userTable.find((userpin) => userpin.pin === pin.pin && !userpin.isAdmin);
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    let typeOfDay = new Date(now).toLocaleDateString("en-GB", { weekday: "long" });
    try {
      if (foundPin && pin.pin.length >= 3) {
        const query = await handleClocked(weekNumber, typeOfDay, foundPin.email);

        setClockedLoading(false);
        if (query.message.endsWith("out.")) {
          toast.info(query.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
          return;
        }
        toast.success(query.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      } else if (!foundPin) {
        setClockedLoading(false);
        toast.error(`User is not found.`, {
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
      toast.error(query.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      setClockedLoading(false);
    }

    setPin({ pin: "" });
  };

  return (
    <div className="flex flex-col bg-[--clsec] w-[100%] h-[100%] relative">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
      </div>
      {modal && (
        <div className="modalBG fixed right-0 left-0 bg-black/50 top-0 bottom-0 z-40 text-center flex flex-col items-center" onClick={(e) => (String(e.target?.className).startsWith("modalBG") ? setModal(!modal) : null)}>
          <div className="fixed right-0 left-[35%] bg-white top-0 bottom-0 z-40 text-center flex flex-col items-center">
            <button className="absolute top-0 left-0 p-4 text-xl animate-fadeUP1 z-[60]" onClick={() => setModal(!modal)}>
              ◀ Back
            </button>

            <div className="overflow-auto px-2 w-[90%] ml-auto pr-8 relative grid grid-cols-6 gap-2 mt-20">
              <div className="flex my-3 relative flex-col col-span-4">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Venue</span>
                <p className="p-4 text-lg border-y-2 border-y-black/30 font-[600] tracking-wide shadow-lg rounded-xl">The Test Venue</p>
              </div>
              <div className="flex my-3 relative flex-col col-span-2">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">ID</span>
                <p className="p-4 text-lg border-y-2 border-y-black/30 font-[600] tracking-wide shadow-lg rounded-xl">101010</p>
              </div>

              <div className="flex my-3 relative flex-col col-span-6">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Email</span>
                <p className="p-4 text-lg border-y-2 border-y-black/30 font-[600] tracking-wide shadow-lg rounded-xl">testvenue@testvenue.test</p>
              </div>
              <div className="flex my-3 relative flex-col col-span-6">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Address</span>
                <p className="p-4 text-lg border-y-2 border-y-black/30 font-[600] tracking-wide shadow-lg rounded-xl">Test Street, TestCity AA1 1AA</p>
              </div>
              <div className="flex my-3 relative flex-col col-span-3">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Website</span>
                <p className="p-4 text-lg border-y-2 border-y-black/30 font-[600] tracking-wide shadow-lg rounded-xl">thetestvenue.test.test</p>
              </div>
              <div className="flex my-3 relative flex-col col-span-3">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Phone</span>
                <p className="p-4 text-lg border-y-2 border-y-black/30 font-[600] tracking-wide shadow-lg rounded-xl">12345 1234 123</p>
              </div>

              <p className="col-span-6 p-4">
                Details are set by developers and all data related to this app is using these details. If you require an update or change please contact your representative or email Mihai
                <a className="transition border-b-2 border-b-orange-400 py-1 bg-orange-400 px-4 rounded-lg" href={`mailto:alemihai25@gmail.com?subject=101010 POS - Query - ${new Date().toLocaleDateString()}&amp;body=Your message...`}>
                  here
                </a>
                .
              </p>

              <div className="flex my-3 relative flex-col col-span-6">
                <span className="absolute -top-2 left-10 bg-white rounded-lg px-4">Enabled Features</span>
                <div className="p-4 text-lg border-y-2 border-y-black/30 font-[600] tracking-wide shadow-lg rounded-xl flex flex-wrap justify-center">
                  <p className="py-1 px-3 border-2 rounded-lg m-1">Stock Management</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1">Clock In/Out</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1">Sales Forecast</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1">Weather Forecast</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1 text-gray-300">Misc Product</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1">Discounts</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1 text-gray-300">Bill Splitting</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1">Left Hand Mode</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1">Charts</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1">Visual Table Plan</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1 text-gray-300">List Table Plan</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1 text-gray-300">ROTA Management</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1 text-gray-300">Payroll</p>
                  <p className="py-1 px-3 border-2 rounded-lg m-1 text-gray-300">Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2 justify-end flex-nowrap p-2 absolute top-0 right-0 z-50">
        <span onClick={() => setModal(!modal)} className="text-5xl p-1 mr-3 text-black/90 hover:scale-[1.1] transition cursor-pointer">
          <FaCogs />
        </span>
      </div>
      <div className="flex w-[100%] h-[100%]">
        <div className={`transition animate-fadeFromLeft basis-[80%] max-md:basis-[100%] flex flex-col gap-[3vh] h-[98%] my-auto justify-center items-center`}>
          <div className={`h-[100%] bg-[--c30] ml-auto border-r-4 rounded shadow-xl shadow-[#0a0a0a] flex flex-col w-[80%] p-4 min-h-[80svh] relative justify-start border-2 border-[--c12] max-w-[650px]`}>
            <p className="font-black text-3xl tracking-widest text-center">CCW POS</p>
            <img className="max-w-[10svh] max-h-[10svh] mx-auto" src="./assets/d956248b8cfe7fe8fa39033b50728bcb.jpg" />
            <div className="text-center">
              <p className="font-bold text-lg">Welcome!</p>
              <p>Sign in to start to order.</p>
            </div>

            <div className={`flex grow flex-col`}>
              <p className="text-center h-[24px]">
                {pin.pin.split("").map((symbol, index) => {
                  return "*";
                })}
              </p>
              <div className="keypad grid grid-cols-4 gap-4 my-4">
                <button name="1" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  1
                </button>
                <button name="2" onClick={handlePinInput} className=" bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  2
                </button>

                <button name="3" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  3
                </button>

                <button name="si" onClick={checkPin} className="row-span-2 bg-[--c12] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  SignIn
                </button>

                <button name="4" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  4
                </button>
                <button name="5" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  5
                </button>
                <button name="6" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  6
                </button>
                <button name="7" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  7
                </button>
                <button name="8" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  8
                </button>
                <button name="9" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  9
                </button>
                <button name="cio" onClick={handleClock} className="row-span-2 bg-[--c12] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  Clock In/Out
                </button>
                <button name="c" onClick={handlePinInput} className="bg-[--c12] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  C
                </button>
                <button name="0" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  0
                </button>
                <button name="b" onClick={handlePinInput} className="bg-[--c12] rounded px-[1vw] py-[3vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                  <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path opacity="0" d="M21 9.648C21 5.82037 20.1796 5 16.352 5H10.7515C10.267 5 9.79904 5.17584 9.43446 5.49485L3.72017 10.4948C2.80952 11.2917 2.80952 12.7083 3.72018 13.5052L9.43446 18.5052C9.79904 18.8242 10.267 19 10.7515 19H16.352C20.1796 19 21 18.1796 21 14.352V9.648Z" fill="#000"></path>
                      <path d="M21 9.648C21 5.82037 20.1796 5 16.352 5H10.7515C10.267 5 9.79904 5.17584 9.43446 5.49485L3.72017 10.4948C2.80952 11.2917 2.80952 12.7083 3.72018 13.5052L9.43446 18.5052C9.79904 18.8242 10.267 19 10.7515 19H16.352C20.1796 19 21 18.1796 21 14.352V9.648Z" stroke="#000" strokeWidth="2" strokeLinejoin="round"></path> <path d="M12 10L16 14" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M16 10L12 14" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                  </svg>
                </button>
              </div>
              <div
                className="scan mt-auto relative cursor-pointer mx-auto"
                ref={fp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={() => {
                  setIsScanning(true);
                  handleScanStart();
                }}
                onMouseUp={() => setIsScanning(false)}>
                <h6 className="absolute opacity-0 -top-1/2">Scanning...</h6>
                <div className="fingerprint"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
