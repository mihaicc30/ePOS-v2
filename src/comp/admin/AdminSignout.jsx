import React, { useEffect } from "react";
import "./AdminSignout.css";
import { useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";



const Signout = ({ user, setUser, setVenueNtable}) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
      localStorage.clear();
      localStorage.setItem("venueID",101010)
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="absolute inset-0 grow bg-[--c60] z-10 overflow-y-scroll flex flex-col justify-center items-center">
      <div className="ui-loader loader-blk">
        <svg viewBox="22 22 44 44" className="multiColor-loader">
          <circle
            cx="44"
            cy="44"
            r="20.2"
            fill="none"
            strokeWidth="3.6"
            className="loader-circle loader-circle-animation"
          ></circle>
        </svg>
      </div>
      <p className="mt-8 text-xl">Signing out..</p>
    </div>
  );
};

export default Signout;
