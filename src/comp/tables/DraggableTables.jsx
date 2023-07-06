import React, { useState } from "react";

const DraggableTables = () => {
  const [divs, setDivs] = useState([
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 200, y: 200 },
    { id: "C", x: 400, y: 400 },
  ]);

  const handleMouseDown = (event, id) => {
    const { clientX, clientY } = event;
    const { left, top } = event.target.getBoundingClientRect();

    setDivs((prevDivs) => prevDivs.map((div) => (div.id === id ? { ...div, x: clientX - left, y: clientY - top } : div)));

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setDivs((prevDivs) =>
      prevDivs.map((div) => ({
        ...div,
        x: clientX - div.x,
        y: clientY - div.y,
      }))
    );
  };

  const handleMouseUp = (event) => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative">
      {divs.map((div) => (
        <div key={div.id} className="ui-widget-content dragable h-[100px] w-[100px] bg-blue-400" style={{ left: div.x, top: div.y }} onMouseDown={(event) => handleMouseDown(event, div.id)}>
          <p>{div.id}</p>
        </div>
      ))}
    </div>
  );
};

export default DraggableTables;
