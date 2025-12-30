import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function First() {
  const [candidates, setCandidates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [countryFilter, setCountryFilter] = useState("all");
  const [countries, setCountries] = useState([]);
  const empId = Number(localStorage.getItem("id"));

  /* ================= FETCH CANDIDATES ================= */
  const fetchCandidates = async () => {
    try {
      const res = await axios.get("https://rev-comp-backend.onrender.com/api/candidates");
      setCandidates(res.data);
    } catch (error) {
      console.log("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  /* ================= FETCH COUNTRIES ================= */
  useEffect(() => {
    axios
      .get("https://rev-comp-backend.onrender.com/api/country/data")
      .then((response) => setCountries(response.data))
      .catch((err) => console.log("Error fetching countries", err));
  }, []);

  /* ================= FORMAT DATE ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  /* ================= CHECK IF DATE IS PAST ================= */
  const isPastDate = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    const followUpDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    followUpDate.setHours(0, 0, 0, 0);

    return followUpDate < today;
  };

  /* ================= APPLY COUNTRY FILTER HERE ================= */
  const filteredByCountry = candidates.filter((candidate) => {
    return (
      countryFilter === "all" ||
      candidate.country_name?.toLowerCase() === countryFilter.toLowerCase()
    );
  });

  /* ================= FILTER FIRST FOLLOW UPS ================= */
  const pendingCandidates = filteredByCountry.filter(
    (candidate) =>
      candidate.first_f_status === "PENDING" &&
      isPastDate(candidate.first_f_date) &&
      candidate.assigned_emp_id === empId
  );

  /* ================= CHECKBOX HANDLER ================= */
  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= UPDATE STATUS ================= */
  const handleSave = async () => {
     if (selectedRows.length === 0) {
      return alert("⚠ Select at least one candidate!");
    }
    const result = await Swal.fire({
    title: "Are you sure?",
    text: "The records move to DONE.",
    // icon: "warning",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  })
    if (result.isConfirmed) {
      // Put your undo code here
    try {
      await axios.put("https://rev-comp-backend.onrender.com/api/candidates/update-status", {
        ids: selectedRows,
        stage: "first",
      });

     Swal.fire({
        // title: "✔ Done!",
        // text: "Updated Successfully",
        icon: "success",
        timer: 500,            // closes after 5 sec
        showConfirmButton: false
      });


      setSelectedRows([]);
      fetchCandidates();
    } catch (error) {
      console.log(error);
       Swal.fire({
        icon: "failed",
        timer:1500,
        showCancelButton: false

       });
    }
    } else {
      // User pressed Cancel
      console.log("Cancelled");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container">

      

      <div className="d-flex justify-content-between align-items-center">
        <h5 className="">
          First Follow Up Pending :{" "}
          <span className="count-badge">{pendingCandidates.length}</span>
        </h5>

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
              <th>1st Follow-Up</th>
              <th>Status</th>
              <th>Employee</th>
              <th>Country</th>
              <th>Update</th>
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
                    <a href={candidate.website} target="_blank" rel="noreferrer">
                      {candidate.website}
                    </a>
                  </td>
                  <td className="td-wrap">{candidate.email}</td>
                  <td className="td-wrap">{candidate.phone}</td>
                  <td className="td-wrap">{formatDate(candidate.date_of_register)}</td>
                  <td className="td-wrap" style={{ color: "red", fontWeight: "bold" }}>
                    {formatDate(candidate.first_f_date)}
                  </td>
                  <td className="td-wrap">{candidate.first_f_status}</td>
                  <td className="td-wrap">{candidate.emp_name}</td>
                  <td className="td-wrap">{candidate.country_name}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(candidate.candidate_id)}
                      onChange={() => handleCheckbox(candidate.candidate_id)}
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
