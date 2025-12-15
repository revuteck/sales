import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [designation, setDesignation] = useState("superadmin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://rev-comp-backend.onrender.com/api/auth/login", {
        email,
        password,
      });

      const { token, designation: role, emp_name: empName, emp_id: empId} = response.data;

      // Save session values
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", empName);
      localStorage.setItem("email", email)
      localStorage.setItem("id", empId);

      setMessage("Login successful! Redirecting...");

      // Redirect based on **role from database**
      switch (role) {
        case "superadmin":
          navigate("/superadmin/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        // case "manager":
        //   navigate("/manager/dashboard");
        //   break;
        case "hr":
          navigate("/hr/dashboard");
          break;
        case "sales":
          navigate("/sales/dashboard");
        // case "sales":
        //   navigate("/sales/dashboard");
          break;
        default:
          navigate("/login");
      }

    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-comp d-flex justify-content-center align-items-center min-vh-100 w-100">
      <form className="shadow p-4 rounded bg-white" style={{ width: "350px" }} onSubmit={handleLogin}>
        <h3 className="text-center mb-4">Login</h3>

        {/* designation dropdown */}
        {/* <div className="mb-3">
          <label className="form-label">Designation</label>
          <select 
            className="form-control"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
          <option value="manager">Manager</option>
            <option value="hr">HR</option>
            <option value="sales">Sales</option>
          </select>
        </div> */}

        {/* email */}
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input 
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            required 
          />
        </div>

        {/* password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            required 
          />
        </div>

        {/* status message */}
        {message && (
          <div className="alert alert-info text-center py-2" role="alert">
            {message}
          </div>
        )}

        {/* submit button */}
        <button type="submit" className="btn btn-primary w-100 mt-2">
          Login
        </button>
      </form>
    </div>
  );
}
