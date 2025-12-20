import React, { useState } from "react";
import First from "./Follow_Ups/First";
import Second from "./Follow_Ups/Second";
import Third from "./Follow_Ups/Third";
import Fourth from "./Follow_Ups/Fourth";

export default function Pendings() {
  const [activeStage, setActiveStage] = useState("first"); // default selected

  return (
    <div className="container">
      {/* ---- FOLLOW UP BUTTONS ---- */}
      <div className="follow-buttons d-flex gap-3 justify-content-center">
        <button
          className={`btn m-1 ${
            activeStage === "first" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveStage("first")}
        >
          First Follow Up
        </button>

        <button
          className={`btn m-1 ${
            activeStage === "second" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveStage("second")}
        >
          Second Follow Up
        </button>

        <button
          className={`btn m-1 ${
            activeStage === "third" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveStage("third")}
        >
          Third Follow Up
        </button>

        <button
          className={`btn m-1 ${
            activeStage === "fourth" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveStage("fourth")}
        >
          Fourth Follow Up
        </button>
      </div>

      {/* ---- COMPONENT RENDER ---- */}
      <div>
        {activeStage === "first" && <First />}
        {activeStage === "second" && <Second />}
        {activeStage === "third" && <Third />}
        {activeStage === "fourth" && <Fourth />}
      </div>
    </div>
  );
}
