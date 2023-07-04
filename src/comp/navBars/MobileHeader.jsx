import React from "react";
import { auth } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

const MobileHeader = () => {
	const [user, loading, error] = useAuthState(auth);
	return (
			<div className="basis-[10%] flex min-sm:gap-4 bg-[--c30] min-sm:py-4 relative max-sm:flex-col">
				<div className="basis-[20%] flex flex-col text-center text-lg font-semibold">
					<img
						src="./assets/d956248b8cfe7fe8fa39033b50728bcb.jpg"
						className="w-[100px] mx-auto"
					/>
				</div>
				<div className="basis-[60%] flex flex-col text-center justify-center text-lg font-semibold">
					<p className="font-bold">Welcome to CCW POS</p>
					<p className="text-sm">{user.displayName}</p>
					<p className="text-sm">Order your favorite items right here!</p>
				</div>
			</div>
	);
};

export default MobileHeader;
