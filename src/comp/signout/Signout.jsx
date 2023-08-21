import React, { useEffect } from "react";
import "./Signout.css";
import { useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

import { auth, logout } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

const Signout = ({ setVenueNtable}) => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if(loading) return
    const timeout = setTimeout(() => {
      setVenueNtable({ venue: null, table: null });
      navigate("/");
      logout()
      localStorage.clear();
    }, 1100);

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
      <p className="mt-8 text-xl">Logging user out...</p>
    </div>
  );
};

export default Signout;
