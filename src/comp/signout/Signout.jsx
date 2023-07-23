import React, { useEffect } from "react";
import "./Signout.css";
import { useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth, logout } from "../../firebase/config.jsx";

const Signout = ({ setUser, setVenueNtable }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}leaveTable`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            tableNumber: localStorage.getItem("tableID") ? localStorage.getItem("tableID") : "signout",
            user: { displayName: localStorage.getItem("displayName"), email: localStorage.getItem("email") },
            venue: localStorage.getItem("venueID"),
          }),
        });
        const data = await response.json();
        if (response.status == 200) {
          setVenueNtable({ venue: null, table: null });
          navigate("/");
          localStorage.clear();

          // -----temp enabled
          localStorage.setItem("forecast7", "true");

          console.log(data.message);
        } else {
          toast.error(`${data.message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
          // TEMPORARY
          setVenueNtable({ venue: null, table: null });
          navigate("/");
          localStorage.clear();

          // -----temp enabled
          localStorage.setItem("forecast7", "true");

          console.log(data.message);
          // TEMPORARY
        }
      } catch (error) {
        console.error("Error fetching:", error);
        toast.error(error.message, {
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
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="absolute inset-0 grow bg-[--c60] z-10 overflow-y-scroll flex flex-col justify-center items-center">
      <div className="absolute">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
      <div className="ui-loader loader-blk">
        <svg viewBox="22 22 44 44" className="multiColor-loader">
          <circle cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" className="loader-circle loader-circle-animation"></circle>
        </svg>
      </div>
      <p className="mt-8 text-xl">Signing out..</p>
    </div>
  );
};

export default Signout;
