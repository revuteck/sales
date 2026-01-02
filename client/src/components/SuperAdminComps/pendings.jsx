import React, { useState } from "react";
import First from "../Follow_Ups/First";
import Second from "../Follow_Ups/Second";
import Third from "../Follow_Ups/Third";
import Fourth from "../Follow_Ups/Fourth";

export default function Pendings() {
  const [activeView, setActiveView] = useState("first"); // default selected

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center">

        {/* ---- BUTTONS ---- */}
        <div className="follow-buttons d-flex gap-3 flex-wrap justify-content-center">
          <button
            onClick={() => setActiveView("first")}
            className={`btn ${
              activeView === "first"
                ? "btn-dark active-btn"
                : "btn-outline-dark"
            }`}
          >
            First Follow Up
          </button>

          <button
            onClick={() => setActiveView("second")}
            className={`btn ${
              activeView === "second"
                ? "btn-dark active-btn"
                : "btn-outline-dark"
            }`}
          >
            Second Follow Up
          </button>

          <button
            onClick={() => setActiveView("third")}
            className={`btn ${
              activeView === "third"
                ? "btn-dark active-btn"
                : "btn-outline-dark"
            }`}
          >
            Third Follow Up
          </button>

          <button
            onClick={() => setActiveView("fourth")}
            className={`btn  ${
              activeView === "fourth"
                ? "btn-dark active-btn"
                : "btn-outline-dark"
            }`}
          >
            Fourth Follow Up
          </button>
        </div>

        {/* ---- CONTENT ---- */}
        <div className="w-100 m-1">
          {activeView === "first" && <First />}
          {activeView === "second" && <Second />}
          {activeView === "third" && <Third />}
          {activeView === "fourth" && <Fourth />}
        </div>
      </div>
    </div>
  );
}
