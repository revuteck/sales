import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function TodayAllSent() {
  const [candidates, setCandidates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [countries, setCountries] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [activeStage, setActiveStage] = useState("first");

  const [searchEmp, setSearchEmp] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

  const [todayGroups, setTodayGroups] = useState({});

  const token = localStorage.getItem("token");

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

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    load();
    loadEmployees();
    loadCountries();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/candidates",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCandidates(res.data);
    } catch (err) {
      console.log("Error fetching candidates:", err);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/employee/data"
      );
      setEmployees(res.data);
    } catch (err) {
      console.log("Error fetching employees:", err);
    }
  };

  const loadCountries = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/country/data"
      );
      setCountries(res.data);
    } catch (err) {
      console.log("Error fetching countries:", err);
    }
  };

  /* ---------------- APPLY FILTERS ---------------- */
  const filteredCandidates = candidates.filter((c) => {
    const matchEmp = searchEmp === "all" || c.assigned_emp_id == searchEmp;

    const matchCountry =
      countryFilter === "all" ||
      c.country_name?.trim().toLowerCase() ===
        countryFilter.trim().toLowerCase();

    return matchEmp && matchCountry;
  });

  /* ---------------- BUILD TODAY DONE GROUPS ---------------- */
  useEffect(() => {
    const groups = { first: [], second: [], third: [], fourth: [] };

    filteredCandidates.forEach((c) => {
      if (c.first_f_status === "DONE" && isToday(c.first_done_dt))
        groups.first.push(c);

      if (c.second_f_status === "DONE" && isToday(c.second_done_dt))
        groups.second.push(c);

      if (c.third_f_status === "DONE" && isToday(c.third_done_dt))
        groups.third.push(c);

      if (c.fourth_f_status === "DONE" && isToday(c.fourth_done_dt))
        groups.fourth.push(c);
    });

    setTodayGroups(groups);
  }, [filteredCandidates]);

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

    const result = await Swal.fire({
      text: `Selected rows will be moved back to ${capitalStage} PENDING.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Undo",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        "http://localhost:5000/api/candidates/undo-status",
        {
          ids: selectedRows,
          stage: capitalStage,
        }
      );

      Swal.fire({ icon: "success", timer: 500, showConfirmButton: false });
      setSelectedRows([]);
      await load();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Undo Failed",
        text: "Something went wrong.",
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

  /* ---------------- Render Table (no stage buttons inside) ---------------- */
  const renderTable = (label, list, stageKey, dateField) => (
    <div className="section-block mt-3">
      <h5 className="m-0">
        {label} : <span className="count-badge">{list.length}</span>
      </h5>

      {/* Filter + Undo row */} 
      <div className="d-flex justify-content-end align-items-center gap-3 mt-3">

        {/* Employee Filter */}
        <div className="floating-field">
          <label className="floating-label">Employee</label>
          <select
            className="form-control floating-select"
            value={searchEmp}
            onChange={(e) => setSearchEmp(e.target.value)}
            style={{ width: "160px" }}
          >
            <option value="all">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_name}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div className="floating-field">
          <label className="floating-label">Country</label>
          <select
            className="form-control floating-select"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            style={{ width: "160px" }}
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              c.status === "ACTIVE" &&
              <option
                key={c.country_id}
                value={c.country_name}
                disabled={c.status !== "ACTIVE"}
              >
                {c.country_name}
              </option>
            ))}
          </select>
        </div>

        {/* Undo button */}
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleUndo(stageKey)}
        >
          Undo Selected
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper mt-2">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Email</th>
              <th>Date</th>
              <th>Emp</th>
              <th>Status</th>
              <th>Select</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((c) => (
                <tr key={c.candidate_id}>
                  <td>{c.candidate_id}</td>
                  <td>{c.comp_name}</td>
                  <td>{c.email}</td>
                  <td>{formatDate(c[dateField])}</td>
                  <td>{c.emp_name}</td>
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
                <td colSpan="7" className="text-center text-muted">
                  No records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const selectedStage = stages.find((s) => s.key === activeStage);

  return (
    <div className="container">

      {/* -------- Stage Buttons -------- */}
      <div className="d-flex gap-2 justify-content-center flex-wrap mt-4">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`btn ${
              activeStage === s.key ? "btn-dark" : "btn-outline-dark"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* -------- Table -------- */}
      {renderTable(
        selectedStage.label,
        todayGroups[selectedStage.key] || [],
        selectedStage.key,
        selectedStage.date
      )}
    </div>
  );
}
