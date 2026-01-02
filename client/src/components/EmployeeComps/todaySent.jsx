import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function TodaySent() {
  const [candidates, setCandidates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeStage, setActiveStage] = useState("first");
  const [todayGroups, setTodayGroups] = useState({});

  const token = localStorage.getItem("token");
  const empId = Number(localStorage.getItem("id"));

  /* ---------------- Helper Functions ---------------- */
  const isToday = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const t = new Date();
    return (
      d.getFullYear() === t.getFullYear() &&
      d.getMonth() === t.getMonth() &&
      d.getDate() === t.getDate()
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const d = new Date(dateString);

    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------------- Fetch Candidates ---------------- */
  
    const load = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/candidates",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const mine = res.data.filter((c) => c.assigned_emp_id === empId);
        setCandidates(mine);
      } catch (err) {
        console.log("Error fetching:", err);
      }
    };
  useEffect(() => {
    load();
  }, []);

  /* ---------------- BUILD TODAY DONE GROUPS ---------------- */
  useEffect(() => {
    const groups = {
      first: [],
      second: [],
      third: [],
      fourth: [],
    };

    candidates.forEach((c) => {
      if (c.first_f_status === "DONE" && isToday(c.first_done_dt)) {
        groups.first.push({ ...c, stage: "First" });
      }
      if (c.second_f_status === "DONE" && isToday(c.second_done_dt)) {
        groups.second.push({ ...c, stage: "Second" });
      }
      if (c.third_f_status === "DONE" && isToday(c.third_done_dt)) {
        groups.third.push({ ...c, stage: "Third" });
      }
      if (c.fourth_f_status === "DONE" && isToday(c.fourth_done_dt)) {
        groups.fourth.push({ ...c, stage: "Fourth" });
      }
    });

    setTodayGroups(groups);
  }, [candidates]);

  /* ---------------- Undo Function ---------------- */
  const handleUndo = async (stageKey) => {
  if (selectedRows.length === 0) {
    return Swal.fire({
      icon: "warning",
      title: "No Selection!",
      text: "Please select at least one record.",
      timer: 1500,
      showConfirmButton: false,
    });
  }

  const capitalStage = stageKey.charAt(0).toUpperCase() + stageKey.slice(1);

  // Confirm Box
  const result = await Swal.fire({
    text: `Selected rows will be moved back to ${capitalStage} PENDING.`,
    showCancelButton: true,
    confirmButtonText: "Yes, Undo",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  if (!result.isConfirmed) return; // User clicked Cancel

  try {
    // API call
    await axios.put(
      "http://localhost:5000/api/candidates/undo-status",
      {
        ids: selectedRows,
        stage: capitalStage,
      }
    );

    // Success Alert
    Swal.fire({
      icon: "success",
      timer: 500,
      showConfirmButton: false,
    });

    setSelectedRows([]);
    await load();
    
  } catch (err) {
    console.log(err);

    // Error Alert
    Swal.fire({
      icon: "error",
      title: "Undo Failed",
      text: "Something went wrong. Try again!",
    });
  }
};


  /* ---------------- Stage Config ---------------- */
  const stages = [
    { key: "first", label: "First Follow Up", date: "first_done_dt" },
    { key: "second", label: "Second Follow Up", date: "second_done_dt" },
    { key: "third", label: "Third Follow Up", date: "third_done_dt" },
    { key: "fourth", label: "Fourth Follow Up", date: "fourth_done_dt" },
  ];

  /* ---------------- Render Table ---------------- */
  const renderTable = (label, list, stageKey, dateField) => (
    <div className="section-block">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">
          {label} : <span className="count-badge">{list.length}</span>
        </h5>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleUndo(stageKey)}
        >
          Undo Selected
        </button>
      </div>

      <div className="table-wrapper mt-2 table-wrap">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{width:"10px"}}>ID</th>
              <th>Domain</th>
              <th>Company</th>
              <th>Email</th>
              <th>Website</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{width:"10px"}}>Select</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((c) => (
                <tr key={c.candidate_id}>
                  
                  <td>{c.candidate_id}</td>
                  <td>{c.comp_domain}</td>
                  <td>{c.comp_name}</td>
                  <td>{c.email}</td>
                  <td><a href={c.website}>{c.website}</a></td>
                  <td>{formatDate(c[dateField])}</td>
                  <td className="text-success fw-bold">DONE</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(c.candidate_id)}
                      onChange={() => handleCheckbox(c.candidate_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  <strong>🎉 No completed follow-ups today</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ---------------- UI RENDER ---------------- */
  return (
    <div className="container">

      {/* -------- Stage Buttons -------- */}
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`btn m-1 ${
              activeStage === s.key ? "btn-dark" : "btn-outline-dark"
            }`}
            style={{ minWidth: "150px" }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* -------- Table of Selected Stage -------- */}
     {stages
  .filter((s) => s.key === activeStage)
  .map((s) => (
    <div key={s.key}>
      {renderTable(
        s.label,
        todayGroups[s.key] || [],
        s.key,
        s.date
      )}
    </div>
  ))}

    </div>
  );
}
