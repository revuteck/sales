import React, { useEffect, useState } from "react";
import axios from "axios";
import CalendarFilter from "../../../utilities/CalendarFilter";

export default function SentMails() {
  const [candidates, setCandidates] = useState([]);
  const [activeStage, setActiveStage] = useState("first");
  const [selectedDate, setSelectedDate] = useState(null); // FIXED

  const empId = localStorage.getItem("id");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/candidates/emp?empId=${empId}`)
      .then((res) => setCandidates(res.data.empId))
      .catch((err) => console.log(err));
  }, [empId]);

  /* ------------ STAGE CONFIG ------------ */
  const stages = [
    { key: "first", status: "first_f_status", date: "first_f_date", label: "First Follow Up" },
    { key: "second", status: "second_f_status", date: "second_f_date", label: "Second Follow Up" },
    { key: "third", status: "third_f_status", date: "third_f_date", label: "Third Follow Up" },
    { key: "fourth", status: "fourth_f_status", date: "fourth_f_date", label: "Fourth Follow Up" },
  ];

  /* ------------ DATE FORMAT ------------ */
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  /* ------------ APPLY DATE FILTER ------------ */
  const filterByDate = (list, dateField) => {
    if (!selectedDate) return list; // no filter applied

    return list.filter(
      (c) => selectedDate === formatDate(c[dateField])
    );
  };

  /* ------------ GROUP COMPLETED ------------ */
  const groupedCompleted = Object.fromEntries(
    stages.map((s) => {
      const completedList = candidates.filter((c) => c[s.status] === "DONE");
      const dateFilteredList = filterByDate(completedList, s.date);
      return [s.key, dateFilteredList];
    })
  );

  /* ------------ RENDER TABLE ------------ */
  const renderTable = (label, list, stageKey, statusField, dateField) => (
    <div className="section-block">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">
          {label} : <span className="count-badge">{list.length}</span>
        </h5>

        {/* DATE FILTER UI */}
        <div className="floating-field d-flex date-input-wrapper" style={{ width: "125px" }}>
          <CalendarFilter
            onSelectDate={(date) => setSelectedDate(date)}
          />
          <input
            type="text"
            value={selectedDate || ""}
            className="form-control pad_30px"
            disabled
            readOnly
          />
          {selectedDate && (
            <span className="clear-btn-input" onClick={() => setSelectedDate(null)}>
              ✖
            </span>
          )}
        </div>
      </div>

      <div className="table-wrapper mt-2 table-wrap">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "2px" }}>No.</th>
              {/* <th style={{ width: "10px" }}>ID</th> */}
              <th>Domain</th>
              <th>Company</th>
              <th>Website</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Completed</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((c, index) => (
                <tr key={c.candidate_id}>
                  <td className="td-wrap">{index+1}</td>
                  {/* <td className="td-wrap">{c.candidate_id}</td> */}
                  <td className="td-wrap">{c.comp_domain}</td>
                  <td className="td-wrap">{c.comp_name}</td>
                  <td className="td-wrap">
                    <a href={c.website} target="_blank" rel="noreferrer">
                      {c.website}
                    </a>
                  </td>
                  <td className="td-wrap">{c.email}</td>
                  <td className="td-wrap">{c.phone}</td>
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
      {/* Stage buttons */}
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`btn m-1 ${activeStage === s.key ? "btn-dark active-btn" : "btn-outline-dark"}`}
            style={{ minWidth: "140px" }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Render selected stage */}
      {stages
        .filter((s) => s.key === activeStage)
        .map((s) =>
          renderTable(s.label, groupedCompleted[s.key], s.key, s.status, s.date)
        )}
    </div>
  );
}
