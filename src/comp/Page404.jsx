import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
    // to force re-download data
    const navigate = useNavigate();
	useEffect(() => {
		navigate("/");
	}, []);

	return null;
};

export default Page404;
