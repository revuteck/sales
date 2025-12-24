import { useState } from "react";
import axios from 'axios'
import Papa from "papaparse";
export default function UploadCSV() {
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

  return (
    <>
    <div className="shadow p-4 rounded bg-white mt-5">
        <h4 className="text-center mb-3">📤 Import Companies via CSV</h4>
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
    </>
  )
}