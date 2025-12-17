import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TodoList() {
  const [candidates, setCandidates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeStage, setActiveStage] = useState("first"); // <-- NEW

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`https://rev-comp-backend.onrender.com/api/candidates`);
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const t = new Date();
    d.setHours(0, 0, 0, 0);
    t.setHours(0, 0, 0, 0);
    return d.getTime() === t.getTime();
  };

  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async (stage) => {
    if (selectedRows.length === 0) return alert("⚠ Select a candidate!");

    try {
      await axios.put(`https://rev-comp-backend.onrender.com/api/candidates/update-status`, {
        ids: selectedRows,
        stage,
      });

      alert("✔ Updated Successfully");
      setSelectedRows([]);
      fetchCandidates();
    } catch (error) {
      console.log(error);
      alert("❌ Update Failed");
    }
  };

  const stages = [
    { key: "first", status: "first_f_status", date: "first_f_date", label: "First Follow Up" },
    { key: "second", status: "second_f_status", date: "second_f_date", label: "Second Follow Up" },
    { key: "third", status: "third_f_status", date: "third_f_date", label: "Third Follow Up" },
    { key: "fourth", status: "fourth_f_status", date: "fourth_f_date", label: "Fourth Follow Up" },
  ];

  const grouped = Object.fromEntries(
    stages.map((s) => [
      s.key,
      candidates.filter(
        (c) => isToday(c[s.date]) && c[s.status] === "PENDING"
      ),
    ])
  );

  const renderTable = (label, list, stageKey, statusField, dateField) => (
    <div className="section-block">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">{label}</h5>
        <button className="btn btn-primary btn-sm" onClick={() => handleSave(stageKey)}>
          Save
        </button>
      </div>

      <div className="table-wrapper mt-3 table-wrap">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Domain</th>
              <th>Company</th>
              <th>Website</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Follow Up</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((c) => (
                <tr key={c.candidate_id}>
                  <td class="td-wrap">{c.candidate_id}</td>
                  <td class="td-wrap">{c.comp_domain}</td>
                  <td class="td-wrap">{c.comp_name}</td>
                  <td class="td-wrap">
                    <a href={`https://${c.website}`} target="_blank" rel="noreferrer">
                      {c.website}
                    </a>
                  </td>
                  <td class="td-wrap">{c.email}</td>
                  <td class="td-wrap">{c.phone}</td>
                  <td class="td-wrap">{formatDate(c[dateField])}</td>
                  <td class="td-wrap">{c[statusField]}</td>
                  <td class="td-wrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(c.candidate_id)}
                      disabled={c[statusField] !== "PENDING"}
                      onChange={() => handleCheckbox(c.candidate_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted"><strong>🎉 No TODO List</strong></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mt-3">

      {/* -------- BUTTONS ADDED HERE -------- */}
      <div className="d-flex gap-2 flex-wrap justify-content-center">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`btn m-1 ${activeStage === s.key ? "btn-dark active-btn" : "btn-outline-dark"
              }`}
            style={{ minWidth: "140px" }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------ */}

      {stages
        .filter((s) => s.key === activeStage)
        .map((s) =>
          renderTable(s.label, grouped[s.key], s.key, s.status, s.date)
        )}
    </div>
  );
}
