import React, { useEffect, useState } from "react";
import axios from "axios";


export default function TodoList() {
  const [candidates, setCandidates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeStage, setActiveStage] = useState("first");
  const [empFilter, setEmpFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [countries, setCountries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  

  /* -------------------- FETCH CANDIDATES -------------------- */
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* -------------------- FETCH COUNTRIES -------------------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country/data")
      .then((response) => setCountries(response.data))
      .catch((err) => console.log("Error fetching countries", err));
  }, []);

  /* -------------------- HELPERS -------------------- */

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

  /* -------------------- CHECKBOX -------------------- */

  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* -------------------- SAVE -------------------- */

  const handleSave = async (stage) => {
    if (selectedRows.length === 0) {
      alert("⚠ Please select at least one candidate");
      return;
    }

    try {
      await axios.put("http://localhost:5000/api/candidates/update-status", {
        ids: selectedRows,
        stage,
      });

      alert("✔ Updated Successfully");
      setSelectedRows([]);
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert("❌ Update Failed");
    }
  };

  /* -------------------- STAGES -------------------- */

  const stages = [
    { key: "first", status: "first_f_status", date: "first_f_date", label: "First Follow Up" },
    { key: "second", status: "second_f_status", date: "second_f_date", label: "Second Follow Up" },
    { key: "third", status: "third_f_status", date: "third_f_date", label: "Third Follow Up" },
    { key: "fourth", status: "fourth_f_status", date: "fourth_f_date", label: "Fourth Follow Up" },
  ];

  /* -------------------- FILTERS -------------------- */

  const filteredList = candidates
    .filter(
      (c) =>
        empFilter === "all" ||
        (c.emp_name &&
          c.emp_name.toLowerCase() === empFilter.toLowerCase())
    )
    .filter(
      (c) =>
        countryFilter === "all" ||
        (c.country_name &&
          c.country_name.toLowerCase() === countryFilter.toLowerCase())
    );

  /* -------------------- GROUPED DATA -------------------- */

  const grouped = Object.fromEntries(
  stages.map((s, index) => {
    const prevStage = stages[index - 1];

    return [
      s.key,
      filteredList.filter((c) => {
        // Current Stage Condition
        const dateToday = isToday(c[s.date]);
        const statusPending = c[s.status] === "PENDING";

        // First follow-up should NOT check previous stage
        if (!prevStage) return dateToday && statusPending;

        // Previous Stage DONE condition
        const prevStatusDone = c[prevStage.status] === "DONE";

        return dateToday && statusPending && prevStatusDone;
      }),
    ];
  })
);


  /* -------------------- TABLE RENDER -------------------- */

  const renderTable = (label, list, stageKey, statusField, dateField) => (
    <div className="section-block">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">
          {label}: <span className="count-badge">{list.length}</span>
        </h5>

        <div className="d-flex">
          
          {/* Country Filter */}
          <div className="floating-field">
            <label className="floating-label">Country</label>
            <select
              className="form-control floating-select"
              style={{ maxWidth: "200px" }}
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <option value="all">All</option>
              {countries.map((country) => (
                country.status === "ACTIVE" &&
                <option key={country.country_name} value={country.country_name}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Filter */}
          <div className="floating-field">
            <label className="floating-label">Emp</label>
            <select
              className="form-control floating-select"
              value={empFilter}
              onChange={(e) => setEmpFilter(e.target.value)}
            >
              <option value="all">All Employees</option>
              {[...new Set(candidates.map((c) => c.emp_name).filter(Boolean))].map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>

          <div className="">
            <button className="btn btn-primary btn-sm" onClick={() => handleSave(stageKey)}>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
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
              <th>Emp Name</th>
              <th>Country</th>
              <th>Follow Up</th>
              <th>Status</th>
              <th>Update</th>
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
                  <td className="td-wrap">{c[statusField]}</td>
                  <td className="td-wrap">
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
                <td colSpan="11" className="text-center text-muted">
                  <strong>🎉 No TODO List</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* -------------------- UI -------------------- */

  return (
    <div className="container">

      {/* Stage Buttons */}
      <div className="d-flex gap-2 flex-wrap justify-content-center">
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

      {/* Active Table */}
      {stages
        .filter((s) => s.key === activeStage)
        .map((s) =>
          renderTable(s.label, grouped[s.key], s.key, s.status, s.date)
        )}
    </div>
  );
}
