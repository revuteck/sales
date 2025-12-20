import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Fourth() {
  const [candidates, setCandidates] = useState([]);
  const empId = Number(localStorage.getItem("id"));
  const [countryFilter, setCountryFilter] = useState("all");
  const [countries, setCountries] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  

  const fetchCandidates= async() => {
    axios
      .get("/api/candidates")
      .then((response) => {
        setCandidates(response.data);
      })
      .catch((error) => {
        console.log("There was an error fetching candidates: " + error);
      });
  }; // <-- FIXED
  useEffect(()=>{
    fetchCandidates();
  }, [])

    /* ================= FETCH COUNTRIES ================= */
  useEffect(() => {
    axios
      .get("/api/country/data")
      .then((response) => setCountries(response.data))
      .catch((err) => console.log("Error fetching countries", err));
  }, []);


  // Format Dates
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Check if the date is in past
  const isPastDate = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const followDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    followDate.setHours(0, 0, 0, 0);

    return followDate < today;
  };
  /* ================= APPLY COUNTRY FILTER HERE ================= */
  const filteredByCountry = candidates.filter((candidate) => {
    return (
      countryFilter === "all" ||
      candidate.country_name?.toLowerCase() === countryFilter.toLowerCase()
    );
  });

  // Filter pending candidates
  const pendingCandidates = candidates.filter(
    (candidate) =>
      candidate.fourth_f_status === "PENDING" &&
      isPastDate(candidate.fourth_f_date) &&
      candidate.assigned_emp_id === empId
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
      return alert("⚠ Select at least one candidate!");
    }

    try {
      await axios.put("/api/candidates/update-status", {
        ids: selectedRows,
        stage: "fourth", // ✅ fixed
      });

      alert("✔ Updated Successfully");

      setSelectedRows([]);
      fetchCandidates(); // refresh table
    } catch (error) {
      console.log(error);
      alert("❌ Update Failed");
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">

      <h5 className="">Fourth Follow-Up Pending :<span className="count-badge">{pendingCandidates.length}</span></h5>
      {/* ******** COUNTRY FILTER ADDED HERE ******** */}
        <div className="d-flex">
          <div className="d-flex justify-content-start">
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
      </div>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          Save
        </button>
        </div>
      </div>
      <div className="table-wrapper mt-3  table-wrap">
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
              <th>Assigned Emp</th>
              <th>Employee</th>
              <th>Country</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {pendingCandidates.length > 0 ? (
              pendingCandidates.map((candidate) => (
                <tr key={candidate.candidate_id}>
                  <td class="td-wrap">{candidate.candidate_id}</td>
                  <td class="td-wrap">{candidate.comp_domain}</td>
                  <td class="td-wrap">{candidate.comp_name}</td>
                  <td class="td-wrap">
                    <a
                      href={candidate.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {candidate.website}
                    </a>
                  </td>
                  <td class="td-wrap">{candidate.email}</td>
                  <td class="td-wrap">{candidate.phone}</td>
                  <td class="td-wrap">{formatDate(candidate.date_of_register)}</td>
                  <td style={{ color: "red", fontWeight: "bold" }} class="td-wrap">
                    {formatDate(candidate.fourth_f_date)}
                  </td>
                  <td class="td-wrap">{candidate.fourth_f_status}</td>
                  {/* <td>{candidate.assigned_emp_id}</td> */}
                  <td class="td-wrap">{candidate.emp_name}</td>
                  <td class="td-wrap">{candidate.country_name}</td>
                   <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(
                        candidate.candidate_id
                      )}
                      onChange={() =>
                        handleCheckbox(candidate.candidate_id)
                      }
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
