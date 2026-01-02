import React, { useEffect, useState } from "react";
import axios from "axios";
import CalendarFilter from "../../utilities/CalendarFilter";

export default function Fourth() {
  const [candidates, setCandidates] = useState([]);
  const [searchEmp, setSearchEmp] = useState("all"); // ✅ emp filter
  const [countryFilter, setCountryFilter] = useState("all");
  const [countries, setCountries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch only once
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/candidates")
      .then((response) => {
        setCandidates(response.data);
      })
      .catch((error) => {
        console.log("There was an error fetching candidates:", error);
      });
  }, []);
  /* -------------------- FETCH COUNTRIES -------------------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country/data")
      .then((response) => setCountries(response.data))
      .catch((err) => console.log("Error fetching countries", err));
  }, []);

  /* ---------------- HELPERS ---------------- */

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const isPastDate = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const followUpDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate < today;
  };

  /* ---------------- EMP LIST ---------------- */

  const employees = [
    ...new Set(candidates.map((c) => c.emp_name).filter(Boolean)),
  ];

  /* ---------------- FILTER LOGIC ---------------- */

  const pendingCandidates = candidates.filter((candidate) => {
    const dateMatch =
      selectedDate === null ||
      formatDate(candidate.fourth_f_date) === selectedDate &&
      candidate.fourth_f_status === "PENDING"

    const statusMatch =
      isPastDate(candidate.fourth_f_date) &&
      candidate.fourth_f_status === "PENDING";
    const empMatch =
      searchEmp === "all" ||
      candidate.emp_name?.toLowerCase() === searchEmp.toLowerCase();

    const countryMatch =
      countryFilter === "all" ||
      candidate.country_name === countryFilter;

    return statusMatch && empMatch && countryMatch && dateMatch;
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>
          Fourth Follow-Up Pending:{" "}
          <span className="count-badge">{pendingCandidates.length}</span>
        </h5>
        <div className="d-flex">
          {/* DATE FILTER */}
          <div className="floating-field d-flex date-input-wrapper" style={{ width: "125px" }}>
            <CalendarFilter
              onSelectDate={(date) => {
                setSelectedDate(date);
              }}
            />
            <input
              type="text"

              value={selectedDate || ""}
              className='form-control pad_30px'
              disabled
              readOnly />
            {selectedDate && (
              <span className="clear-btn-input" onClick={() => setSelectedDate(null)}>
                ✖
              </span>
            )}

          </div>
          {/* CNTRY FILTER */}
          <div className="floating-field">
            <label className="floating-label">Country</label>
            <select
              className="form-control floating-select"
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
          {/* EMP FILTER */}
          <div className="floating-field">
            <label className="floating-label">Emp</label>
            <select
              className="form-control floating-select"
              value={searchEmp}
              onChange={(e) => setSearchEmp(e.target.value)}
            >
              <option value="all">All</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper mt-3 table-wrap">
        <table className="table table-bordered table-hover table-follow-ups">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "10px" }}>ID</th>
              <th>Domain</th>
              <th>Company</th>
              <th>Website</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>4th Follow-up</th>
              <th>Status</th>
              <th>Emp Name</th>
              <th>Country Name</th>
            </tr>
          </thead>

          <tbody>
            {pendingCandidates.length > 0 ? (
              pendingCandidates.map((candidate) => (
                <tr key={candidate.candidate_id}>
                  <td className="td-wrap">{candidate.candidate_id}</td>
                  <td className="td-wrap">{candidate.comp_domain}</td>
                  <td className="td-wrap">{candidate.comp_name}</td>
                  <td className="td-wrap">
                    <a
                      href={candidate.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {candidate.website}
                    </a>
                  </td>
                  <td className="td-wrap"> {candidate.email}</td>
                  <td className="td-wrap">{candidate.phone}</td>
                  <td className="td-wrap">{formatDate(candidate.date_of_register)}</td>
                  <td style={{ color: "red", fontWeight: "bold" }} className="td-wrap">
                    {formatDate(candidate.fourth_f_date)}
                  </td>
                  <td className="td-wrap">{candidate.fourth_f_status}</td>
                  <td className="td-wrap">{candidate.emp_name}</td>
                  <td className="td-wrap">{candidate.country_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center text-muted">
                  <strong>🎉 No Pending Follow Ups</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
