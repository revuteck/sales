import { useState } from "react";
import axios from "axios";
import Papa from "papaparse";



export default function addCandidate() {
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
  const empID = localStorage.getItem("id");
  const empName = localStorage.getItem("name");

  const [message, setMessage] = useState("");
  const [csvmessage, setCsvMessage] = useState("");

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
        "https://rev-comp-backend.onrender.com/api/candidates/add",
        { ...formData, empID, empName },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );

      setMessage("Candidate Added Successfully!");
      alert("Candidate Added Successfully!")
      setTimeout(() => {
        window.location.reload();   // refresh after 1 sec
      }, 1000); // 1000ms = 1 sec

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
        // countryName:"" declared in backend fetching from db country name based on id
      });

    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add employee");
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

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        rows.map(r => {
          console.log("Registe fooo: ", formatDate(r.date_of_register))
          console.log("Firstf fooo: ", formatDate(r.first_f_date))
        })


        const formattedRows = rows.map(r => ({

          domain: r.comp_domain,
          name: r.comp_name,
          website: r.website,
          email: r.email,
          phone: r.phone && r.phone.trim() !== "" ? r.phone : null,



          dateReg: formatDate(r.date_of_register),
          firstFollow: formatDate(r.first_f_date),
          firstStatus: r.first_f_status,

          secondFollow: formatDate(r.second_f_date),
          secondStatus: r.second_f_status || "PENDING",

          thirdFollow: formatDate(r.third_f_date),
          thirdStatus: r.third_f_status || "PENDING",

          fourthFollow: formatDate(r.fourth_f_date),
          fourthStatus: r.fourth_f_status || "PENDING",

          finalStatus: r.final_status || "PENDING",
          empID: empID,
          empName: empName,
          countryId: r.country_id,
          countryName: r.country_name
        }));

        setCsvData(formattedRows); // <-- store extracted CSV data
        setCsvMessage("CSV file ready to upload!");
        // alert("CSV file ready to upload!")
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
      setTimeout(() => {
        window.location.reload();   // refresh after 1 sec
      }, 1000); // 1000ms = 1 sec
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload CSV";

      setCsvMessage(msg);
    }

  };

  console.log("data from csv:", csvData)
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
      {/* <div className="or_sec">
        <span>OR</span>
      </div>

      <div className="shadow p-4 rounded bg-white mt-5">
        <h4 className="text-center mb-3">📤 Import Companies via CSV</h4>
        <div className="mb-3">
          <input
            type="file"
            accept=".csv,text/csv,application/vnd.ms-excel"
            className="form-control"
            onChange={handleCSVUpload}
          />
        </div> */}


        {/* STATUS */}
        {/* {csvmessage && (
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


      </div> */}

    </div>
  );
}
