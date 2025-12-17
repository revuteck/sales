import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";

export default function AddCandidate() {

  const [employees, setEmployees] = useState([]);
  const [csvData, setCsvData] = useState([]);

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
  const [csvmessage, setCsvMessage] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://rev-comp-backend.onrender.com/api/employee/data", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

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

      setFormData({
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

    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add candidate");
    }
  };


  //FORMAT DATES
  const formatDate = (value) => {
    if (!value) return null; // important for DB

    // If already in YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    // Handle DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [day, month, year] = value.split("-");
      return `${year}-${month}-${day}`;
    }

    // Handle Excel serial numbers
    if (!isNaN(value)) {
      const excelDate = new Date((value - 25569) * 86400 * 1000);
      return excelDate.toISOString().slice(0, 10);
    }

    return null;
  };

  // GET THE DATA FROM .CSV FILE 
  const handleCSVUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ❗ Admin must select employee first
  if (!formData.empID || !formData.empName) {
    alert("Please select an employee before uploading CSV");
    return;
  }

  // ❗ Admin must select country (optional but recommended)
  

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: ({ data }) => {

      const formattedRows = data.map(r => ({
        domain: r.comp_domain,
        name: r.comp_name,
        website: r.website,
        email: r.email,
        phone: r.phone && r.phone.trim() !== "" ? r.phone : null,


        dateReg: formatDate(r.date_of_register),
        firstFollow: formatDate(r.first_f_date),
        firstStatus: r.first_f_status || "PENDING",

        secondFollow: formatDate(r.second_f_date),
        secondStatus: r.second_f_status || "PENDING",

        thirdFollow: formatDate(r.third_f_date),
        thirdStatus: r.third_f_status || "PENDING",

        fourthFollow: formatDate(r.fourth_f_date),
        fourthStatus: r.fourth_f_status || "PENDING",

        finalStatus: r.final_status || "PENDING",

        // ✅ ADMIN ASSIGNMENT (THIS IS THE KEY FIX)
        empID: formData.empID,
        empName: formData.empName,

        // ✅ Country from UI (not CSV)
        countryId: r.country_id,
        countryName: r.country_name
      }));

      setCsvData(formattedRows);
      setCsvMessage(`CSV ready: ${formattedRows.length} records loaded`);
    }
  });
};


  const handleCSVSubmit = async () => {
    if (csvData.length === 0) {
      return setCsvMessage("No CSV data found! Please upload a CSV first.");
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://rev-comp-backend.onrender.com/api/bulk/candidates/bulk-insert",
        { data: csvData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCsvMessage("CSV Uploaded Successfully!");
      alert("CSV Uploaded Successfully!")
      setCsvData([]); // reset
    } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to upload CSV";

      setCsvMessage(msg);
}

  };
console.log("Admin csv file data:", csvData)
  return (
    <div className="container mt-4">
      {/* <h3 className="mb-3 text-center">Add New Company</h3> */}

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
            <option value="1">Saudi Arabia</option>
            <option value="2">Singapore</option>
            <option value="3">Qatar</option>
            <option value="4">UAE</option>
          </select>
        </div>

        {/* Inputs */}
        <input className="form-control mb-3" type="text" name="domain" placeholder="Company Domain" value={formData.domain} onChange={handleChange} required />
        <input className="form-control mb-3" type="text" name="name" placeholder="Company Name" value={formData.name} onChange={handleChange} required />
        <input className="form-control mb-3" type="text" name="website" placeholder="Website" value={formData.website} onChange={handleChange} required />
        <input className="form-control mb-3" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className="form-control mb-3" type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange}/>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <button type="submit" className="btn btn-success w-100">Add Company</button>
      </form>

      {/* -------------------------------------
           📁 Excel Upload Section (No Logic Yet)
      -------------------------------------- */}
      <div className="or_sec">
        <span>OR</span>
      </div>

      <div className="shadow p-4 rounded bg-white mt-5">
        <h4 className="text-center mb-3">📤 Import Companies via CSV</h4>
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
        <div className="mb-3">
          <input
            type="file"
            accept=".csv,text/csv,application/vnd.ms-excel"
            className="form-control"
            onChange={handleCSVUpload}
          />
        </div>


        {/* STATUS */}
        {csvmessage && (
          <div className="alert alert-info text-center py-2">{csvmessage}</div>
        )}
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={() => {
            if (window.confirm("Are you sure you want to upload?")) {
              handleCSVSubmit();
            }
          }}
        >
          Upload CSV
        </button>


      </div>

    </div>
  );
}
