import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Candidates from "./Candidates";

export default function Dashboard() {
  const Navigate = useNavigate();
  const[view , setView] = useState([])
  const [counts, setCounts] = useState({
    employees: 0,
    candidates: 0,
    // pending: 0,
  });

  useEffect(() => {
    // You will replace these API calls with yours 👇
    getCounts();
  }, []);

  const getCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      

      // Example endpoints — replace with your own
      const empRes = await axios.get("http://localhost:5000/api/employee/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const candRes = await axios.get("http://localhost:5000/api/candidates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // const pendingRes = await axios.get("http://localhost:5000/api/candidates/pendingCount", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      setCounts({
        employees: empRes.data.length,
        candidates: candRes.data.length,
        // pending: pendingRes.data.count,
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {view === "candidates" ? (
        <Candidates />) :(
          <div className="container py-4">
          <h2 className="mb-4 fw-bold">📊 Dashboard Overview</h2>

      <div className="row g-4">

        {/* Total Candidates */}
        <div className="col-md-4">
          <div className="dash-card shadow"  onClick={()=> setView('candidates')}>
            <div className="icon bg-primary">
              👤
            </div>
            <div>
              <span className="label">Total Companies</span>
              <h2 className="value">{counts.candidates}</h2>
            </div>
          </div>
        </div>

        {/* Employees */}
        <div className="col-md-4">
          <div className="dash-card shadow">
            <div className="icon bg-success">
              🧑‍💼
            </div>
            <div>
              <span className="label">Total Employees</span>
              <h2 className="value">{counts.employees}</h2>
            </div>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="col-md-4">
          <div className="dash-card shadow">
            <div className="icon bg-danger">
              ⏳
            </div>
            <div>
              <span className="label">Pending Follow-ups</span>
              <h2 className="value text-danger">{counts.pending}</h2>
            </div>
          </div>
        </div>

      </div>
      </div>
        )
      
      }
    
    </>
  );
}
