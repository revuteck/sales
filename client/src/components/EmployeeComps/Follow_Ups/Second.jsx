import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CalendarFilter from "../../../utilities/CalendarFilter";

export default function Second() {
  const [candidates, setCandidates] = useState([]);
  const empId = Number(localStorage.getItem("id"));
  const [countryFilter, setCountryFilter] = useState("all");
  const [countries, setCountries] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchCandidates = async () => {
    axios
      .get("http://localhost:5000/api/candidates")
      .then((response) => setCandidates(response.data))
      .catch((error) =>
        console.log("There was an error fetching candidates: " + error)
      );
  }; // <-- FIX: Dependency array added
  useEffect(() => {
    fetchCandidates()
  }, [])

  /* ================= FETCH COUNTRIES ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country/data")
      .then((response) => setCountries(response.data))
      .catch((err) => console.log("Error fetching countries", err));
  }, []);


  // ---------- FORMAT DATE ----------
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // ---------- CHECK IF DATE IS BEFORE TODAY ----------
  const isPastDate = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    const followUpDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    followUpDate.setHours(0, 0, 0, 0);

    return followUpDate < today;
  };


  // ---------- FILTER PENDING ----------
  const pendingCandidates = candidates.filter(
    (candidate) =>
      candidate.second_f_status === "PENDING" &&
      isPastDate(candidate.second_f_date) &&
      candidate.assigned_emp_id === empId
  );

  const filteredPending = candidates.filter(c => {
    const isPending = c.second_f_status === "PENDING" &&
      isPastDate(c.second_f_date) &&
      c.assigned_emp_id === empId && c.final_status !== "FAILED";

    const matchCountry =
      countryFilter === "all" ||
      c.country_name?.toLowerCase() === countryFilter.toLowerCase();

    const matchDate =
      !selectedDate || selectedDate === formatDate(c.second_f_date);

    return isPending && matchCountry && matchDate;
  });

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

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "The records move to DONE.",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: {
    popup: "compact-swal",
  },
    })
    if (result.isConfirmed) {
      // Put your undo code here
      try {
        await axios.put("http://localhost:5000/api/candidates/update-status", {
          ids: selectedRows,
          stage: "second",
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
          timer: 1500,
          showCancelButton: false

        });
      }
    } else {
      // User pressed Cancel
      console.log("Cancelled");
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="">Second Follow Up Pending : <span className="count-badge">{filteredPending.length}</span></h5>
        {/* ******** COUNTRY FILTER ADDED HERE ******** */}
        <div className="d-flex">
          <div className="d-flex justify-content-start">
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
      <div className="table-wrapper mt-3 table-wrap">
        <table className="table table-bordered table-hover table-follow-ups">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "2px" }}>No</th>
              {/* <th style={{ width: "10px" }}>ID</th> */}
              <th>Domain</th>
              <th>Company</th>
              <th>Website</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>2nd Follow-up</th>
              <th>Status</th>
              {/* <th>Emp ID</th> */}
              <th>Employee</th>
              <th>Country</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {filteredPending.length > 0 ? (
              filteredPending.map((candidate, index) => (
                <tr key={candidate.candidate_id}>
                  <td class="td-wrap">{index+1}</td>
                  {/* <td class="td-wrap">{candidate.candidate_id}</td> */}
                  <td class="td-wrap">{candidate.comp_domain}</td>
                  <td class="td-wrap">{candidate.comp_name}</td>
                  <td class="td-wrap">
                    <a href={candidate.website} target="_blank" rel="noreferrer">
                      {candidate.website}
                    </a>
                  </td>
                  <td class="td-wrap">{candidate.email}</td>
                  <td class="td-wrap">{candidate.phone}</td>
                  <td class="td-wrap">{formatDate(candidate.date_of_register)}</td>
                  <td style={{ fontWeight: "bold", color: "red" }} class="td-wrap">
                    {formatDate(candidate.second_f_date)}
                  </td>
                  <td class="td-wrap">{candidate.second_f_status}</td>
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
