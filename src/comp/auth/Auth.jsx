import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    db,
    auth,
    logInWithEmailAndPassword,
    signInWithGoogle,
    signInWithPopup,
    signInWithFacebook,
  } from "../../firebase/config.jsx";


const Auth = () => {
  const [user, loading, error] = useAuthState(auth);


  return (
    <div>
      <h1>auth</h1>
      <button onClick={signInWithGoogle}>signin google</button>
    </div>
  )
}

export default Auth
 