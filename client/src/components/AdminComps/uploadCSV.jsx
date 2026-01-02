import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";

export default function UploadCSV() {

  const [employees, setEmployees] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [csvmessage, setCsvMessage] = useState("");

  const [formData, setFormData] = useState({
    empID: "",
    empName: "",
    countryId: "",
    countryName: ""
  });

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
        "http://localhost:5000/api/employee/data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };


  // -------------------------
  // HANDLE EMPLOYEE SELECT
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
  // FORMAT DATE
  // -------------------------
  const formatDate = (value) => {
    if (!value) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [d, m, y] = value.split("-");
      return `${y}-${m}-${d}`;
    }

    if (!isNaN(value)) {
      const excelDate = new Date((value - 25569) * 86400 * 1000);
      return excelDate.toISOString().slice(0, 10);
    }

    return null;
  };

  // -------------------------
  // CSV UPLOAD
  // -------------------------
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!formData.empID || !formData.empName) {
      alert("Please select an employee before uploading CSV");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const formattedRows = data.map((r) => ({
          domain: r.comp_domain,
          name: r.comp_name,
          website: r.website,
          email: r.email,
          phone: r.phone?.trim() !== "" ? r.phone : null,

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

          empID: formData.empID,
          empName: formData.empName,

          countryId: r.country_id,
          countryName: r.country_name
        }));

        setCsvData(formattedRows);
        setCsvMessage(`CSV ready: ${formattedRows.length} records loaded`);
      }
    });
  };

  // -------------------------
  // SUBMIT CSV TO BACKEND
  // -------------------------
  const handleCSVSubmit = async () => {
    if (csvData.length === 0) {
      return setCsvMessage("No CSV data found! Please upload a CSV first.");
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/bulk/candidates/bulk-insert",
        { data: csvData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCsvMessage("CSV Uploaded Successfully!");
      alert("CSV Uploaded Successfully!");

      setCsvData([]);

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to upload CSV";
      setCsvMessage(msg);
    }
  };


  return (
    <>
      <div className="shadow p-4 rounded bg-white mt-5">
        <h4 className="text-center mb-3">📤 Import Companies via CSV</h4>

        {/* EMPLOYEE DROPDOWN */}
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
            {employees.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_name}
              </option>
            ))}
          </select>
        </div>

        {/* CSV UPLOAD */}
        <div className="mb-3">
          <input
            type="file"
            accept=".csv,text/csv,application/vnd.ms-excel"
            className="form-control"
            onChange={handleCSVUpload}
          />
        </div>

        {/* STATUS MESSAGE */}
        {csvmessage && (
          <div className="alert alert-info text-center py-2">{csvmessage}</div>
        )}

        {/* UPLOAD BUTTON */}
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
    </>
  );
}
