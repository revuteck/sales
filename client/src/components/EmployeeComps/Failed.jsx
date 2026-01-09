import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddComp from './addFailed';
import Swal from 'sweetalert2';

export default function Failed() {

  const [candidates, setCandidates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchCountry, setSearchCountry] = useState("all");
  const [view, setView]  = useState("");
  // Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [domain, setDomain] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  

  const empId = localStorage.getItem("id");

  // FETCH CANDIDATES
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/candidates/emp?empId=${empId}`)
      .then((response) => {
        const allCandidates = response.data.empId || [];
        const failed = allCandidates.filter(
          (c) => c.final_status?.toUpperCase() === "FAILED"
        );
        setCandidates(failed);
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
      });
  }, [empId]);

  // FETCH COUNTRIES
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country/data")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries", err));
  }, []);

  // FILTERED LIST
  const filteredCandidates = candidates.filter((c) => {
    if (searchCountry === "all") return true;
    return c.country_name?.toLowerCase() === searchCountry.toLowerCase();
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  /* ============= CHECKBOX HANDLER ================= */
  const handleCheckbox = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ============= MOVE TO PENDING ================= */
  const handlemove = async () => {
  if (selectedRows.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No candidate selected",
       width: 350,
      text: "⚠ Select at least one candidate!",
      customClass: {
    popup: "compact-swal",
  },
    });
    return;
  }

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will move the candidate(s) to PENDING status.",
    // icon: "warning",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
     width: 350,
     height: 200,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    customClass: {
    popup: "compact-swal",
  },
  });

  if (!result.isConfirmed) return;

  try {
    await axios.put("http://localhost:5000/api/candidates/final-status", {
      ids: selectedRows,
      status: "PENDING",
    });

    Swal.fire({
      icon: "success",
      title: "Moved successfully!",
      timer: 1000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error moving companies",
    });
  }
};


  /* ============= MARK FAILED (Bulk) ============= */
  const handleMarkFailed = async () => {
    if (selectedRows.length === 0) return alert("⚠ Select at least one candidate!");

    try {
      await axios.put("http://localhost:5000/api/candidates/final-status", {
        ids: selectedRows,
        status: "FAILED",
      });

      alert("Marked as FAILED successfully!");
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Error marking companies as FAILED");
    }
  };

  /* ============= ADD NEW FAILED COMPANY (Popup) ============= */
  const handleAddFailed = async () => {
    if (!domain || !name) return alert("Domain & Name required!");

    try {
      const empId = localStorage.getItem("id");

      await axios.post("http://localhost:5000/api/candidates/add-failed", {
        domain,
        name,
        website,
        email,
        phone,
        empId,
      });

      alert("Company added as FAILED!");
      setShowPopup(false);
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Error adding company");
    }
  };

  console.log(selectedRows);

  return (
    <div>
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <h5 style={{ marginBottom: "0px" }}>
          Failed Companies:
          <span className="count-badge"> {filteredCandidates.length}</span>
        </h5>

        <div className='d-flex'>
          
          {/* Country Filter */}
          <div className="floating-field">
            <label className="floating-label">Country</label>
            <select
              className="form-control floating-select"
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
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

          <button className="btn btn-primary btn-sm ms-2" onClick={handlemove}>
            Move
          </button>

          {/* <button className="btn btn-danger btn-sm ms-2" onClick={handleMarkFailed}>
            Mark Failed
          </button> */}

          <button 
            className="btn btn-danger btn-sm ms-2" 
            onClick={() =>{ 
              setView("addcomp");
              setShowPopup(true)}}
          >
            + Add Failed
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper mt-4"
       style={{ maxHeight: "570px", overflowY: "auto", overflowX: "hidden" }}
      >
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{width:"2px"}}>No.</th>
              {/* <th style={{width:"10px"}}>Id</th> */}
              <th>Domain</th>
              <th>Company</th>
              <th>Website</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Reg Date</th>
              <th>Emp</th>
              <th>Country</th>
              <th>Status</th>
              <th style={{width:"10px"}}></th>
            </tr>
          </thead>

          <tbody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((c, index) => (
                <tr key={c.candidate_id} style={{ background: "red" }}>
                  <td style={{width:"2px"}} >{index+1}</td>
                  {/* <td className='td-wrap'>{c.candidate_id}</td> */}
                  <td className='td-wrap'>{c.comp_domain}</td>
                  <td className='td-wrap'>{c.comp_name}</td>
                  <td className='td-wrap'>
                    <a href={c.website} target="_blank" rel="noreferrer">
                      {c.website}
                    </a>
                  </td>
                  <td className='td-wrap'>{c.email}</td>
                  <td className='td-wrap'>{c.phone}</td>
                  <td className='td-wrap'>{formatDate(c.date_of_register)}</td>
                  <td className='td-wrap'>{c.emp_name}</td>
                  <td className='td-wrap'>{c.country_name}</td>
                  <td className='td-wrap'>{c.final_status}</td>
                  <td className='td-wrap'>
                    <input type="checkbox"
                      checked={selectedRows.includes(c.candidate_id)}
                      onChange={() => handleCheckbox(c.candidate_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center text-muted">
                  No Failed Records ❌
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* POPUP FORM */}
      {view === "addcomp" && showPopup && (
                          <div className="modal fade show"
                              style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
      
                              <div className="modal-dialog" style={{ maxWidth: "auto", width: "auto" }}>
                                  <div className="model-content-sec" style={{ position: "relative" }}>
      
                                      <div className="d-flex justify-content-between align-items-center"
                                          style={{ padding: "10px 20px" }}>
      
                                          <h4 className="m-0">Add Failed Company</h4>
      
                                          <button className="btn-close" onClick={() => setShowPopup(false)}></button>
                                      </div>
      
                                      <AddComp />
                                  </div>
                              </div>
      
                          </div>
                      )}

    </div>
  );
}
