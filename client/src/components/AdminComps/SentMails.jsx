import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SentMails() {
  const [candidates, setCandidates] = useState([]);
  const [activeStage, setActiveStage] = useState("first");

  useEffect(() => {
    axios
      .get(`https://rev-comp-backend.onrender.com/api/candidates`)
      .then((res) => setCandidates(res.data))
      .catch((err) => console.log(err));
  }, []);

  /* ------------ SAME STAGE CONFIG AS YOUR TODO LIST ------------ */
  const stages = [
    { key: "first", status: "first_f_status", date: "first_f_date", label: "First Follow Up" },
    { key: "second", status: "second_f_status", date: "second_f_date", label: "Second Follow Up" },
    { key: "third", status: "third_f_status", date: "third_f_date", label: "Third Follow Up" },
    { key: "fourth", status: "fourth_f_status", date: "fourth_f_date", label: "Fourth Follow Up" },
  ];

  /* ------------ FILTER COMPLETED BY FOLLOW-UP STAGE ------------ */
  const groupedCompleted = Object.fromEntries(
    stages.map((s) => [
      s.key,
      candidates.filter((c) => c[s.status] === "DONE")
    ])
  );

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  /* ------------ TABLE RENDERER (COPIED FROM TODO LIST STYLE) ------------ */
  const renderTable = (label, list, stageKey, statusField, dateField) => (
    <div className="section-block">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">
          {label} : <span className="count-badge">{list.length}</span>
        </h5>
      </div>

      <div className="table-wrapper mt-3 table-wrap">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{width:"10px"}}>ID</th>
              <th>Domain</th>
              <th>Company</th>
              <th>Website</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Emp</th>
              <th style={{width:"10px"}}>Country</th>
              <th style={{width:"20px"}}>Completed</th>
              <th style={{width:"10px"}}>Status</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((c) => (
                <tr key={c.candidate_id}>
                  <td className="td-wrap">{c.candidate_id}</td>
                  <td className="td-wrap">{c.comp_domain}</td>
                  <td className="td-wrap">{c.comp_name}</td>
                  <td className="td-wrap">
                    <a href={c.website} target="_blank" rel="noreferrer">
                      {c.website}
                    </a>
                  </td>
                  <td className="td-wrap">{c.email}</td>
                  <td className="td-wrap">{c.phone}</td>
                  <td className="td-wrap">{c.emp_name}</td>
                  <td className="td-wrap">{c.country_name}</td>
                  <td className="td-wrap">{formatDate(c[dateField])}</td>
                  <td className="text-success fw-bold td-wrap">{c[statusField]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  <strong>🎉 No Completed Records</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container">
      {/* -------- STAGE BUTTONS (SAME AS TODO LIST) -------- */}
      <div className="d-flex gap-2 justify-content-center flex-wrap ">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`btn m-1 ${
              activeStage === s.key ? "btn-dark active-btn" : "btn-outline-dark"
            }`}
            style={{ minWidth: "140px" }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* -------- RENDER SELECTED STAGE -------- */}
      {stages
        .filter((s) => s.key === activeStage)
        .map((s) =>
          renderTable(s.label, groupedCompleted[s.key], s.key, s.status, s.date)
        )}
    </div>
  );
}
