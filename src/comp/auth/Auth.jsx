import React, { useState, useEffect, useRef } from "react";
import "./Auth.css";
import { db, auth, logInWithEmailAndPassword, signInWithGoogle, signInWithPopup, signInWithFacebook } from "../../firebase/config.jsx";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

import { authUser, setVenue } from "../../utils/authUser";
// mimic db
const userTable = [
  {
    displayName: "Mihai C",
    email: "alemihai25@gmail.com",
    autoStore:false,
    darkMode:false,
    lefty:false,
    pin: "111",
    fingerprint: "",
    venueID: 1,
    isAdmin: 1,
  },
  {
    displayName: "Test User",
    email: "Test@Test.Test",
    autoStore:false,
    darkMode:false,
    lefty:false,
    pin: "000",
    fingerprint: "",
    venueID: 101010,
    isAdmin: 0,
  },
];

const Auth = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const fp = useRef(null);

  useEffect(() => {
    if (user) navigate("/Tables");
  }, [user]);

  const [pin, setPin] = useState({
    pin: "",
    pin2: "",
  });

  const handleBackspace = () => {
    setPin((prevPin) => ({
      ...prevPin,
      pin: prevPin.pin.slice(0, -1),
      pin2: prevPin.pin2.slice(0, -1),
    }));
  };

  const handleClear = () => {
    setPin({ pin: "", pin2: "" });
  };

  const handleNumber = (name) => {
    if (isNaN(name)) return;

    setPin((prevPin) => ({
      ...prevPin,
      pin: "*".repeat(prevPin.pin2.length + 1),
      pin2: prevPin.pin2 + name,
    }));
  };

  const handlePinInput = (e) => {
    const { name } = e.target;

    if (name === "b") {
      handleBackspace();
    } else if (name === "c") {
      handleClear();
    } else {
      handleNumber(name);
    }
  };

  useEffect(() => {
    const foundPin = userTable.find((userpin) => userpin.pin === pin.pin2);
    if (foundPin && pin.pin2.length == 3) {
      authUser(foundPin);
      setVenue(setVenue, foundPin);
      setPin({ pin: "", pin2: "" });
      navigate("/Tables");
    } else if (!foundPin && pin.pin2.length >= 3) {
      setPin({ pin: "", pin2: "" });
    }
  }, [pin.pin2]);

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
        fpRef.classList.add("animate-shake");
        setTimeout(() => {
          fpRef.classList.remove("animate-shake");
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

  return (
    <div className="flex bg-[--clsec] animate-fadeUP1">
      <div className="basis-[60%] max-md:basis-[100%] flex flex-col gap-[3vh] min-h-[100svh] justify-center items-center ">
        <div className="bg-[--c30] rounded shadow-lg shadow-[#535353] flex flex-col w-[80%] p-4 min-h-[80svh] relative justify-start border-2 border-[--c12] max-w-[650px]">
          <p className="font-black text-3xl tracking-widest text-center">CCW POS</p>
          <img className="max-w-[15svh] max-h-[15svh] mx-auto" src="./assets/d956248b8cfe7fe8fa39033b50728bcb.jpg" />
          <div className="text-center">
            <p className="font-bold text-lg">Welcome!</p>
            <p>Sign in to start to order.</p>
          </div>

          <div className="grow flex flex-col">
            <input type="text" className="text-center" defaultValue={pin.pin} />
            <div className="keypad grid grid-cols-3 gap-4 my-4 animate-fadeUP1">
              <button name="1" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                1
              </button>
              <button name="2" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                2
              </button>
              <button name="3" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                3
              </button>
              <button name="4" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                4
              </button>
              <button name="5" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                5
              </button>
              <button name="6" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                6
              </button>
              <button name="7" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                7
              </button>
              <button name="8" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                8
              </button>
              <button name="9" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                9
              </button>
              <button name="c" onClick={handlePinInput} className="bg-[--c3] rounded px-[1vw] py-[2vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                C
              </button>
              <button name="0" onClick={handlePinInput} className="bg-[--c1] rounded px-[1vw] py-[2vh] font-bold text-3xl text-white border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
                0
              </button>
              <button name="b" onClick={handlePinInput} className="bg-[--c3] rounded px-[1vw] py-[2vh] font-bold text-3xl text-black border-b-2 border-b-[--c2] text-[--c2] relative inline-block shadow-xl active:shadow-black active:shadow-inner disabled:bg-[#cecdcd] disabled:text-[#ffffff] disabled:active:shadow-none">
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

      <div className="basis-[40%] ml-auto block max-md:hidden overflow-hidden">
        <div className="overflow-hidden max-h-[100svh]">
          <img src="./assets/img-eWJbfpAtsnldJ5hRNnNHl.jpeg" className="ml-auto aspect-auto" />
          <img src="./assets/img-FG3J2WMxkew7bcOilt4BG.jpeg" className="ml-auto aspect-auto" />
          <img src="./assets/img-HiPyM5L04ZqdZG74hUvLM.jpeg" className="ml-auto aspect-auto" />
          <img src="./assets/img-LfA4ebR2EcyVlRcRnmEbV.jpeg" className="ml-auto aspect-auto" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
