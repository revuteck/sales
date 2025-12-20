import { useState } from "react";
import axios from "axios";

export default function AddEmp() {

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    login_role: "",
    email: "",
    password: "",
  });

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
        "https://rev-comp-backend.onrender.com/api/employee/add",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );

      setMessage("Employee Added Successfully!");
      setFormData({
        name: "",
        designation: "",
        login_role: "",
        email: "",
        password: "",
      });
     

    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add employee");
    }
  };


  return (
    <div className="container mt-4">
      {/* <h3 className="mb-3 text-center">Add New Employee</h3> */}

      <form className="shadow p-4 rounded bg-white" onSubmit={handleSubmit}>

        {/* NAME */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </div>

        

        {/* PHONE */}
        {/* <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input 
            type="text" 
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div> */}

        {/* DESIGNATION */}
        <div className="mb-3">
          <label className="form-label">Employee Designation</label>
          <select 
            name="designation"
            className="form-control"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* LOGIN ROLE */}
        <div className="mb-3">
          <label className="form-label">Login Permission Role</label>
          <select 
            name="login_role"
            className="form-control"
            value={formData.login_role}
            onChange={handleChange}
            required
          >
            <option value="">Select Login Access</option>
            <option value="admin">Admin Login</option>
            <option value="manager">Manager Login</option>
            <option value="hr">HR Login</option>
            <option value="sales">Sales Login</option>
          </select>
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

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label">Set Login Password</label>
          <input 
            type="password" 
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        {/* STATUS */}
        {message && (
          <div className="alert alert-info text-center py-2">{message}</div>
        )}

        {/* BUTTON */}
        <button type="submit" className="btn btn-success w-100 mt-2">
          Add Employee
        </button>
      </form>
    </div>
  );
}
