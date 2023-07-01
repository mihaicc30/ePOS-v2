import React from 'react'
import {
  logout
  } from "../../firebase/config.jsx";

const Menu = () => {
  return (
    <div>
      <h1>menu</h1>
      <button onClick={logout}>sign out</button>
    </div>
  )
}

export default Menu
