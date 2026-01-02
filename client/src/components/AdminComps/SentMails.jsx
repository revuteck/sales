import React, { useEffect, useState } from "react";
import axios from "axios";
import CalendarFilter from "../../utilities/CalendarFilter";

export default function SentMails() {
  const [candidates, setCandidates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [activeStage, setActiveStage] = useState("first");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterEmp, setFilterEmp] = useState("all");

  /* ------------------ FORMAT DATE ------------------ */
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const d = new Date(dateString);

    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  /* ------------------ APPLY FILTERS ------------------ */
  const applyFilters = (records, statusField, dateField) => {
    return records.filter((c) => {
      const recordDateFormatted = c[dateField]
        ? formatDate(c[dateField])
        : null;

      const dateMatch =
        !selectedDate || recordDateFormatted === selectedDate;

      const passCountry =
        filterCountry === "all" ||
        c.country_name.toLowerCase() === filterCountry.toLowerCase();

      const passEmp =
        filterEmp === "all" ||
        c.emp_name.toLowerCase() === filterEmp.toLowerCase();

      return dateMatch && passCountry && passEmp;
    });
  };

  /* ------------------ FETCH CANDIDATES ------------------ */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/candidates`)
      .then((res) => setCandidates(res.data))
      .catch((err) => console.log(err));
  }, []);

  /* ------------------ FETCH COUNTRIES ------------------ */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country/data")
      .then((res) => setCountries(res.data))
      .catch((err) => console.log(err));
  }, []);

  /* ------------------ FETCH EMPLOYEES ------------------ */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/employee/data")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.log(err));
  }, []);

  /* ------------------ STAGE CONFIG ------------------ */
  const stages = [
    { key: "first", status: "first_f_status", date: "first_f_date", label: "First Follow Up" },
    { key: "second", status: "second_f_status", date: "second_f_date", label: "Second Follow Up" },
    { key: "third", status: "third_f_status", date: "third_f_date", label: "Third Follow Up" },
    { key: "fourth", status: "fourth_f_status", date: "fourth_f_date", label: "Fourth Follow Up" },
  ];

  /* ------------------ GROUP BY ------------------ */
  const groupedCompleted = Object.fromEntries(
    stages.map((s) => [
      s.key,
      applyFilters(
        candidates.filter((c) => c[s.status] === "DONE"),
        s.status,
        s.date
      ),
    ])
  );

  /* ------------------ TABLE RENDERER ------------------ */
  const renderTable = (label, list, stageKey, statusField, dateField) => (
    <div className="section-block">

      {/* HEADER FILTERS */}
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0">
          {label} : <span className="count-badge">{list.length}</span>
        </h5>

        <div className="d-flex gap-1 mb-1">

          {/* DATE FILTER */}
          <div className="floating-field d-flex date-input-wrapper" style={{ width: "125px" }}>
            <CalendarFilter onSelectDate={(date) => setSelectedDate(date)} />

            <input
              type="text"
              value={selectedDate || ""}
              className="form-control pad_30px"
              readOnly
            />

            {selectedDate && (
              <span className="clear-btn-input" onClick={() => setSelectedDate(null)}>
                ✖
              </span>
            )}
          </div>

          {/* COUNTRY FILTER */}
          <div className="floating-field">
            <select
              className="form-control"
              style={{ maxWidth: "200px" }}
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="all">All Countries</option>

              {countries
                .filter((c) => c.status === "ACTIVE")
                .map((c) => (
                  <option key={c.country_id} value={c.country_name}>
                    {c.country_name}
                  </option>
                ))}
            </select>
          </div>

          {/* EMPLOYEE FILTER */}
          <div className="floating-field">
            <select
              className="form-control"
              style={{ maxWidth: "200px" }}
              value={filterEmp}
              onChange={(e) => setFilterEmp(e.target.value)}
            >
              <option value="all">All Employees</option>

              {employees.map((e) => (
                <option key={e.emp_id} value={e.emp_name}>
                  {e.emp_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper mt-2 table-wrap">
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
              <th>Country</th>
              <th>Completed</th>
              <th>Status</th>
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
                <td colSpan="10" className="text-center text-muted">
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

      {/* STAGE BUTTONS */}
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        {stages.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`btn m-1 ${
              activeStage === s.key ? "btn-dark" : "btn-outline-dark"
            }`}
            style={{ minWidth: "140px" }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* RENDER TABLE */}
      {stages
        .filter((s) => s.key === activeStage)
        .map((s) =>
          renderTable(s.label, groupedCompleted[s.key], s.key, s.status, s.date)
        )}
    </div>
  );
}
