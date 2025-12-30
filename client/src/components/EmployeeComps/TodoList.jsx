import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TodoList() {
  const [candidates, setCandidates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeStage, setActiveStage] = useState("first");
  const [countryFilter, setCountryFilter] = useState("all");
  const [countries, setCountries] = useState([]);

  const empId = localStorage.getItem("id");

  useEffect(() => {
    fetchCandidates();
  }, [empId]);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`https://rev-comp-backend.onrender.com/api/candidates/emp?empId=${empId}`);
      setCandidates(res.data.empId);
    } catch (err) {
      console.error(err);
    }
  };

  /* -------------------- FETCH COUNTRIES -------------------- */
  useEffect(() => {
    axios
      .get("https://rev-comp-backend.onrender.com/api/country/data")
      .then((response) => setCountries(response.data))
      .catch((err) => console.log("Error fetching countries", err));
  }, []);

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

  /* ---------------- COUNTRY FILTER APPLIED HERE ---------------- */
  const filteredCandidates = candidates.filter((c) => {
    const countryMatch =
      countryFilter === "all" ||
      c.country_name?.toLowerCase() === countryFilter.toLowerCase();

    return countryMatch;
  });

  /* ---------------- GROUPED USING FILTERED CANDIDATES ---------------- */
  const grouped = Object.fromEntries(
  stages.map((s, index) => {
    const prevStage = index > 0 ? stages[index - 1] : null; // ✅ get previous stage

    return [
      s.key,
      filteredCandidates.filter((c) => {
        // Current Stage Condition
        const dateToday = isToday(c[s.date]);
        const statusPending = c[s.status] === "PENDING";

        // First follow-up → no previous stage
        if (!prevStage) {
          return dateToday && statusPending;
        }

        // Previous Stage DONE
        const prevStatusDone = c[prevStage.status] === "DONE";

        return dateToday && statusPending && prevStatusDone;
      }),
    ];
  })
);


  const renderTable = (label, list, stageKey, statusField, dateField) => (
    <div className="section-block">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">
          {label} : <span className="count-badge">{list.length}</span>
        </h5>


        {/* -------- COUNTRY FILTER UI ADDED HERE -------- */}
      <div className="d-flex ">
        <div className="floating-field">
          <label className="floating-label">Country</label>
          <select
            className="form-control floating-select"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            style={{ maxWidth: "250px" }}
          >
            <option value="all">All</option>
            {countries.map((country) => (
              <option key={country.country_name} value={country.country_name}>
                {country.country_name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleSave(stageKey)}
        >
          Save
        </button>
      </div>
        
      </div>

      <div className="table-wrapper mt-3 table-wrap">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "10px" }}>ID</th>
              <th>Domain</th>
              <th>Company</th>
              <th>Website</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country Name</th>
              <th>Follow Up</th>
              <th>Status</th>
              <th style={{width:"5px"}}>Update</th>
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
                  <td className="td-wrap">{c.country_name}</td>
                  <td className="td-wrap">{formatDate(c[dateField])}</td>
                  <td className="td-wrap">{c[statusField]}</td>
                  <td>
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
                <td colSpan="10" className="text-center text-muted">
                  <strong>🎉 No TODO List</strong>
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

      

      {/* -------- STAGE BUTTONS -------- */}
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`btn m-1 ${
              activeStage === s.key
                ? "btn-dark active-btn"
                : "btn-outline-dark"
            }`}
            style={{ minWidth: "140px" }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* -------- TABLE FOR SELECTED STAGE -------- */}
      {stages
        .filter((s) => s.key === activeStage)
        .map((s) =>
          renderTable(s.label, grouped[s.key], s.key, s.status, s.date)
        )}
    </div>
  );
}
