import { useState } from "react";
import axios from "axios";

export default function addCandidate() {

  const [formData, setFormData] = useState({
    domain: "",
    name: "",
    website: "",
    email: "",
    phone: "",
    countryId: ""
    // countryName:""
  });
  const empID = localStorage.getItem("id");
  const empName = localStorage.getItem("name");

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/candidates/add",
        { ...formData, empID, empName },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );

      setMessage("Candidate Added Successfully!");
      setFormData({
        domain: "",
        name: "",
        website: "",
        email: "",
        phone: "",
        countryId: ""
        // countryName:"" declared in backend fetching from db country name based on id
      });

    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add employee");
    }
  };

  console.log(formData, empID, empName)
  return (
    <div className="container mt-3 form-sec-addcan">
      {/* <h3 className="mb-3 text-center">Add New Company</h3> */}

      <form className="shadow p-4 rounded bg-white" onSubmit={handleSubmit}>

        {/* COUNTRY */}
        <div className="mb-3">
          <label className="form-label">Select Country</label>
          <select
            name="countryId"
            className="form-control"
            value={formData.countryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            <option value="1">KANADA</option>
            <option value="2">USA</option>
            <option value="3">SINGAPORE</option>
            <option value="4">UAE</option>
            <option value="5">QATAR</option>
            <option value="6">SAUDI AREBIA</option>
          </select>
        </div>

        {/* Domain */}
        <div className="mb-3">
          <label className="form-label">Company Domain</label>
          <input
            type="text"
            name="domain"
            className="form-control"
            value={formData.domain}
            onChange={handleChange}
            placeholder="Enter domain"
            required
          />
        </div>
        {/* Company name */}
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>


        {/* website name */}
        <div className="mb-3">
          <label className="form-label">Website</label>
          <input
            type="text"
            name="website"
            className="form-control"
            value={formData.website}
            onChange={handleChange}
            placeholder="website"
            required
          />

        </div>


        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter mobile"

          />
        </div>

        {/* STATUS */}
        {message && (
          <div className="alert alert-info text-center py-2">{message}</div>
        )}

        {/* BUTTON */}
        <button type="submit" className="btn btn-success w-100 mt-2">
          Add Candidate
        </button>
      </form>
      {/* -------------------------------------
           📁 Excel Upload Section (No Logic Yet)
      -------------------------------------- */}
      <div className="or_sec">
        <span>
          OR
        </span>
      </div>
      <div className="shadow p-4 rounded bg-white mt-5">

        <h4 className="text-center mb-3">📤 Import Companies via Excel</h4>

        <input type="file" accept=".xlsx,.xls" className="form-control" />

        <button className="btn btn-primary w-100 mt-3" disabled>
          Upload Excel (Coming Soon)
        </button>
      </div>
    </div>
  );
}
