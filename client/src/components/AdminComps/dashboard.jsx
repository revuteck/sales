import { useEffect, useState } from "react";
import axios from "axios";
import Candidates from "./Candidates";

export default function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [counts, setCounts] = useState({
    employees: 0,
    candidates: 0,
    pending: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  });

  const [employeeStats, setEmployeeStats] = useState([]); // NEW

  useEffect(() => {
    getCounts();
  }, []);

  const getCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const empRes = await axios.get("https://rev-comp-backend.onrender.com/api/employee/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const candRes = await axios.get("https://rev-comp-backend.onrender.com/api/candidates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const employees = empRes.data;
      const candidates = candRes.data;

      const activeEmployees = employees.filter(e => e.status === "ACTIVE").length;
      const inactiveEmployees = employees.filter(e => e.status === "INACTIVE").length;

      // ---------------------------------
      // 🔥 EMPLOYEE WORK PROGRESS LOGIC
      // ---------------------------------
      const isToday = (dateString) => {
        if (!dateString) return false;
        const d = new Date(dateString);
        const t = new Date();
        d.setHours(0, 0, 0, 0);
        t.setHours(0, 0, 0, 0);
        return d.getTime() === t.getTime();
      };

      const isPending = (dateString) => {
        if (!dateString) return false;
        const d = new Date(dateString);
        const t = new Date();
        d.setHours(0, 0, 0, 0);
        t.setHours(0, 0, 0, 0);
        return d.getTime() < t.getTime();
      };

      const empWorkStats = employees.map(emp => {
        const assigned = candidates.filter(c => c.assigned_emp_id === emp.emp_id);

        // todays tasks
        const todo = assigned.filter(
          c =>
            (c.first_f_status === "PENDING" && isToday(c.first_f_date)) ||
            (c.second_f_status === "PENDING" && isToday(c.second_f_date)) ||
            (c.third_f_status === "PENDING" && isToday(c.third_f_date)) ||
            (c.fourth_f_status === "PENDING" && isToday(c.fourth_f_date))
        ).length;

        // pending late tasks
        const pending = assigned.filter(
          c =>
            (c.first_f_status === "PENDING" && isPending(c.first_f_date)) ||
            (c.second_f_status === "PENDING" && isPending(c.second_f_date)) ||
            (c.third_f_status === "PENDING" && isPending(c.third_f_date)) ||
            (c.fourth_f_status === "PENDING" && isPending(c.fourth_f_date))
        ).length;

        return {
          emp_name: emp.emp_name,
          totalCompanies: assigned.length,
          todo,
          pending,
        };
      });

      setEmployeeStats(empWorkStats);

      setCounts({
        employees: employees.length,
        candidates: candidates.length,
        pending: candidates.filter(c => c.final_status === "PENDING").length,
        activeEmployees,
        inactiveEmployees
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {view === "candidates" ? (
        <Candidates />
      ) : (
        <div className="container py-4 ad-dash">

          {/* ---- MAIN DASHBOARD ---- */}
          <h4 className="mb-4">Dashboard Overview</h4>
          <div className="row g-4">

            <div className="col-md-4">
              <div className="dash-card shadow" onClick={() => setView("")}>
                <div className="icon bg-primary">👤</div>
                <div>
                  <span className="label">Total Companies</span>
                  <h2 className="value">{counts.candidates}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-success">🧑‍💼</div>
                <div>
                  <span className="label">Total Employees</span>
                  <h2 className="value">{counts.employees}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-danger">⏳</div>
                <div>
                  <span className="label">Pending Follow-ups</span>
                  <h2 className="value text-danger">{counts.pending}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* ---- EMPLOYEE OVERVIEW ---- */}
          <h4 className="mt-5 mb-3">Employee Overview</h4>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-info">🟢</div>
                <div>
                  <span className="label">Active Employees</span>
                  <h2 className="value text-info">{counts.activeEmployees}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-secondary">🔴</div>
                <div>
                  <span className="label">Inactive Employees</span>
                  <h2 className="value text-secondary">{counts.inactiveEmployees}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* ---- NEW EMPLOYEE WORK PROGRESS SECTION ---- */}
          <h4 className="mt-5 mb-4 ">Employee Work Progress</h4>

          <div className="row g-4 overflow-y-auto emp-pro-sec" >
            {employeeStats.map((emp, index) => (
              <div key={index} className="col-md-4">
                <div className="shadow p-3">
                  <h6 className="fw-bold">{emp.emp_name}</h6>
                  <div>🏢 Registered Companies: <b>{emp.totalCompanies}</b></div>
                  <div>📝 Today's Follow ups: <b>{emp.todo}</b></div>
                  <div>⏳ Total Pending: <b className="text-danger">{emp.pending}</b></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
