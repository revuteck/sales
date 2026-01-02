import { useState, useEffect } from "react";
import axios from "axios";

export default function AddFailedCompany() {
  const [countries, setCountries] = useState([]);

  const [formData, setFormData] = useState({
    countryId: "",
    countryName: "",
    domain: "",
    name: "",
    website: "",
    email: "",
    phone: "",
  });

  const empID = localStorage.getItem("id");
  const empName = localStorage.getItem("name");

  const [message, setMessage] = useState("");

  /* ===================== GET COUNTRIES ===================== */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country/data")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries", err));
  }, []);

  /* ===================== INPUT HANDLER ===================== */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ===================== SUBMIT HANDLER ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.countryId) {
      return alert("Please select a country!");
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/candidates/add/failed",
        {
          countryId: formData.countryId,
          countryName:
            countries.find((c) => c.country_id == formData.countryId)
              ?.country_name || "",
          domain: formData.domain,
          name: formData.name,
          website: formData.website,
          email: formData.email,
          phone: formData.phone,
          empId: empID,
          empName: empName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message || "Failed company added!");

      // Reset Form
      setFormData({
        countryId: "",
        countryName: "",
        domain: "",
        name: "",
        website: "",
        email: "",
        phone: "",
      });

      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-3 form-sec-addcan">
      <form className="shadow p-4 rounded bg-white" onSubmit={handleSubmit}>

        {/* ================= COUNTRY FIELD ================= */}
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
            {countries.map((country) => (
              country.status === "ACTIVE" &&
              <option
                key={country.country_id}
                value={country.country_id}
              >
                {country.country_name}
              </option>
            ))}
          </select>
        </div>

        {/* ================= DOMAIN ================= */}
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

        {/* ================= COMPANY NAME ================= */}
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

        {/* ================= WEBSITE ================= */}
        <div className="mb-3">
          <label className="form-label">Website</label>
          <input
            type="text"
            name="website"
            className="form-control"
            value={formData.website}
            onChange={handleChange}
            placeholder="Enter website"
          />
        </div>

        {/* ================= EMAIL ================= */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        {/* ================= PHONE ================= */}
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone"
          />
        </div>

        {/* ================= SHOW MESSAGE ================= */}
        {message && (
          <div className="alert alert-danger text-center py-2">{message}</div>
        )}

        {/* ================= SUBMIT BUTTON ================= */}
        <button type="submit" className="btn btn-danger w-100 mt-2">
          Add Failed Company
        </button>
      </form>
    </div>
  );
}
