import React, { useEffect } from "react";

import { AiOutlineLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

const News = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
  }, []);
  return (
    <div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll p-4 flex flex-col">
      <button className="mr-auto p-2 text-3xl" onClick={() => navigate(-1)}>
        <AiOutlineLeft />
      </button>
      <p className="text-center text-xl">No news posted at the moment! Stay tuned.</p>
    </div>
  );
};

export default News;
