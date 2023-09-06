import React, { useEffect } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";


const Notifications = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);
  return (
    <div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll p-4 flex flex-col">
      <button className="mr-auto p-2 text-3xl" onClick={() => navigate(-1)}>
        <AiOutlineLeft />
      </button>
      <p className="text-center text-xl pb-4 border-b-2">No notifications!</p>
    </div>
  );
};

export default Notifications;
