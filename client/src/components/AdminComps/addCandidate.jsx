import { useState, useEffect } from "react";
import axios from "axios";

export default function AddCandidate() {

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    domain: "",
    name: "",
    website: "",
    email: "",
    phone: "",
    dateReg: "",
    firstFollow: "",
    firstStatus: "",
    secondFollow: "",
    secondStatus: "",
    thirdFollow: "",
    thirdStatus: "",
    fourthFollow: "",
    fourthStatus: "",
    finalStatus: "",
    empID: "",
    empName: "",
    countryId: "",
    countryName: ""
  });

  const [message, setMessage] = useState("");

  // -------------------------
  // FETCH EMPLOYEES
  // -------------------------
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://rev-comp-backend.onrender.com/api/employee/data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // -------------------------
  // HANDLE INPUT CHANGE
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "empID") {
      const selectedEmp = employees.find(emp => emp.emp_id === Number(value));
      setFormData({
        ...formData,
        empID: value,
        empName: selectedEmp ? selectedEmp.emp_name : ""
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // -------------------------
  // SUBMIT MANUAL FORM
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://rev-comp-backend.onrender.com/api/candidates/add",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Candidate Added Successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add candidate");
    }
  };

  return (
    <div className="container mt-4">

      <form className="shadow p-4 rounded bg-white" onSubmit={handleSubmit}>

        {/* Employee Dropdown */}
        <div className="mb-3">
          <label className="form-label"><strong>Select Employee</strong></label>
          <select
            name="empID"
            className="form-control"
            value={formData.empID}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_name}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
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
           <option value="1">CANADA</option>
            <option value="2">USA</option>
            <option value="3">SINGAPORE</option>
            <option value="4">UAE</option>
            <option value="5">QATAR</option>
            <option value="6">SAUDI ARABIA</option>
          </select>
        </div>

        {/* Inputs */}
        <input className="form-control mb-3" type="text" name="domain" placeholder="Company Domain" value={formData.domain} onChange={handleChange} required />
        <input className="form-control mb-3" type="text" name="name" placeholder="Company Name" value={formData.name} onChange={handleChange} required />
        <input className="form-control mb-3" type="text" name="website" placeholder="Website" value={formData.website} onChange={handleChange} required />
        <input className="form-control mb-3" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className="form-control mb-3" type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />

        {message && <div className="alert alert-info text-center">{message}</div>}

        <button type="submit" className="btn btn-success w-100">Add Company</button>
      </form>

    </div>
  );
}
