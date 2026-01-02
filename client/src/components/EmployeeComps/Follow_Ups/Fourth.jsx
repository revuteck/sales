import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CalendarFilter from "../../../utilities/CalendarFilter";

export default function Fourth() {
  const [candidates, setCandidates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [countryFilter, setCountryFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const empId = Number(localStorage.getItem("id"));

  /* ================= FETCH CANDIDATES ================= */
  const fetchCandidates = async () => {
    axios
      .get("http://localhost:5000/api/candidates")
      .then((response) => setCandidates(response.data))
      .catch((error) =>
        console.log("Error fetching candidates:", error)
      );
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  /* ================= FETCH COUNTRIES ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country/data")
      .then((res) => setCountries(res.data))
      .catch((err) => console.log("Error fetching countries", err));
  }, []);

  /* ================= FORMAT DATE ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  /* ================= CHECK PAST DATE ================= */
  const isPastDate = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const followDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    followDate.setHours(0, 0, 0, 0);

    return followDate < today;
  };

  /* ================= APPLY DATE + COUNTRY FILTER ================= */
  const filteredByCountry = candidates.filter((c) => {
    const countryPass =
      countryFilter === "all" ||
      c.country_name?.toLowerCase() === countryFilter.toLowerCase();

    const datePass =
      selectedDate === null ||
      (selectedDate === formatDate(c.fourth_f_date) &&
        c.fourth_f_status === "PENDING");

    return countryPass && datePass;
  });

  /* ================= FINAL PENDING LIST ================= */
  const pendingCandidates = filteredByCountry.filter(
    (c) =>
      c.fourth_f_status === "PENDING" &&
      isPastDate(c.fourth_f_date) &&
      c.assigned_emp_id === empId
  );

  /* ================= CHECKBOX HANDLER ================= */
  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ================= UPDATE STATUS ================= */
  const handleSave = async () => {
    if (selectedRows.length === 0) {
      return alert("⚠ Select at least one record!");
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "The records move to DONE.",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.put("http://localhost:5000/api/candidates/update-status", {
          ids: selectedRows,
          stage: "fourth",
        });

        Swal.fire({
          icon: "success",
          timer: 500,
          showConfirmButton: false,
        });

        setSelectedRows([]);
        fetchCandidates();
      } catch (err) {
        Swal.fire({
          icon: "error",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">

        <h5>
          Fourth Follow-Up Pending :
          <span className="count-badge">{pendingCandidates.length}</span>
        </h5>

        <div className="d-flex">
          <div className="d-flex">

            {/* DATE FILTER */}
            <div className="floating-field d-flex date-input-wrapper" style={{ width: "125px" }}>
              <CalendarFilter
                onSelectDate={(date) => setSelectedDate(date)}
              />
              <input
                type="text"
                value={selectedDate || ""}
                className="form-control pad_30px"
                readOnly
              />
              {selectedDate && (
                <span
                  className="clear-btn-input"
                  onClick={() => setSelectedDate(null)}
                >
                  ✖
                </span>
              )}
            </div>

            {/* COUNTRY FILTER */}
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

          </div>

          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            Save
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper mt-3 table-wrap">
        <table className="table table-bordered table-hover table-follow-ups">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Domain</th>
              <th>Company</th>
              <th>Website</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>4th Follow-up</th>
              <th>Status</th>
              <th>Employee</th>
              <th>Country</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {pendingCandidates.length > 0 ? (
              pendingCandidates.map((c) => (
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
                  <td className="td-wrap">{formatDate(c.date_of_register)}</td>
                  <td className="td-wrap" style={{ color: "red", fontWeight: "bold" }}>
                    {formatDate(c.fourth_f_date)}
                  </td>
                  <td className="td-wrap">{c.fourth_f_status}</td>
                  <td className="td-wrap">{c.emp_name}</td>
                  <td className="td-wrap">{c.country_name}</td>

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
                <td colSpan="12" className="text-center text-muted">
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
