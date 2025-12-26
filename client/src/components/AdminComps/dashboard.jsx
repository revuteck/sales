import { useEffect, useState } from "react";
import axios from "axios";
import Candidates from "./Candidates";

export default function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [counts, setCounts] = useState({
    employees: 0,
    candidates: 0,
    pending: 0,
    completed: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalmails: 0,
    mailstobesent: 0,
    first_remains:0,
    second_remains:0,
    third_remains: 0,
    fourth_remains:0,
    mailspending: 0,
    first_pendings:0,
    second_pendings:0,
    third_pendings:0,
    fourth_pendings:0,
    mailstodo: 0,
    first_todo:0,
    second_todo:0,
    third_todo:0,
    fourth_todo:0,
    
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
        completed: candidates.filter(c => c.final_status === "COMPLETED").length,
        activeEmployees,
        inactiveEmployees,
        totalmails: candidates.length * 4,
        mailstobesent: candidates.filter(c => c.first_f_status === "PENDING").length +
                       candidates.filter(c => c.second_f_status === "PENDING").length +
                       candidates.filter(c => c.third_f_status === "PENDING").length +
                       candidates.filter(c => c.fourth_f_status === "PENDING").length ,
        first_pendings: candidates.filter(c => c.first_f_status === "PENDING" && isPending(c.first_f_date)).length,
        second_pendings: candidates.filter(c => c.second_f_status === "PENDING" && isPending(c.second_f_date)).length,
        third_pendings: candidates.filter(c => c.third_f_status === "PENDING" && isPending(c.third_f_date)).length,
        fourth_pendings: candidates.filter(c => c.fourth_f_status === "PENDING" && isPending(c.fourth_f_date)).length, 
        mailspending : candidates.filter(c =>  c.first_f_status === "PENDING" && isPending(c.first_f_date)).length +
                       candidates.filter(c =>  c.second_f_status === "PENDING" && isPending(c.second_f_date)).length +
                       candidates.filter(c =>  c.third_f_status === "PENDING" && isPending(c.third_f_date)).length +
                       candidates.filter(c =>  c.fourth_f_status === "PENDING" && isPending(c.fourth_f_date)).length,
        first_remains: candidates.filter(c=> c.first_f_status==="PENDING").length,
        second_remains: candidates.filter(c=> c.second_f_status === "PENDING").length,
        third_remains: candidates.filter(c=> c.third_f_status === "PENDING").length,
        fourth_remains: candidates.filter(c=> c.fourth_f_status === "PENDING").length,

        mailstodo :  candidates.filter(c =>  c.first_f_status === "PENDING" && isToday(c.first_f_date)).length +
                     candidates.filter(c =>  c.second_f_status === "PENDING" && isToday(c.second_f_date)).length +
                     candidates.filter(c =>  c.third_f_status === "PENDING" && isToday(c.third_f_date)).length +
                     candidates.filter(c =>  c.fourth_f_status === "PENDING" && isToday(c.fourth_f_date)).length,
      first_todo:   candidates.filter(c =>  c.first_f_status === "PENDING" && isToday(c.first_f_date)).length ,
      second_todo: candidates.filter(c =>  c.second_f_status === "PENDING" && isToday(c.second_f_date)).length ,
      third_todo: candidates.filter(c =>  c.third_f_status === "PENDING" && isToday(c.third_f_date)).length ,
      fourth_todo: candidates.filter(c =>  c.fourth_f_status === "PENDING" && isToday(c.fourth_f_date)).length,
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
                <div className="card-sec">
                  <tr>
                   <th style={{width: "114px"}}><span className="label count-span">Total Companies</span></th>
                   <td><h2 className="value">: {counts.candidates}</h2></td>
                  </tr>
                   
                   <tr>
                    <th style={{width: "114px"}}><span className="label count-span">Total Pendings</span></th>
                    <td><h2 className="value">: {counts.pending}</h2> </td>
                   </tr>
                   <tr>
                    <th style={{width: "114px"}}><span className="label count-span">Total Completed</span></th>
                    <td><h2 className="value">: {counts.completed}</h2> </td>
                     </tr>
                   
                   
                  
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-success">🧑‍💼</div>
                <div className="card-sec">
                  <tr>
                    <th style={{width: "130px"}}><span className="label count-span">Total Employees</span></th>
                    <td><h2 className="value">: {counts.employees}</h2></td>
                  </tr>
                  <tr>
                    <th style={{width: "130px"}}><span className="label count-span">Active Employees</span></th>
                    <td><h2 className="value text-info">: {counts.activeEmployees}</h2></td>
                  </tr>
                  <tr>
                    <th style={{width: "130px"}}><span className="label count-span">Inactive Employees</span></th>
                    <td><h2 className="value text-secondary">: {counts.inactiveEmployees}</h2></td>
                  </tr>
                  
                  
                  
                  
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-danger">⏳</div>
                <div className="card-sec">
                  <tr>
                    <th style={{width: "90px"}}><span className="label count-span">Total Mails</span></th>
                    <td><h2 className="value text-danger">: {counts.totalmails}</h2></td>
                    {/* <td>kk</td> */}
                  </tr>
                  
                  <tr>
                    <th style={{width: "94px"}}><span className="label count-span">Pending Mails</span></th>
                    <td><span>: {counts.first_pendings}+{counts.second_pendings}+{counts.third_pendings}+{counts.fourth_pendings}</span></td>
                    <td><h2 className="value text-danger">={counts.mailspending}</h2></td>
                  </tr>
                  <tr>
                    <th style={{width: "94px"}}><span className="label count-span">TODO Mails</span></th>
                    <td><span>: {counts.first_todo}+{counts.second_todo}+{counts.third_todo}+{counts.fourth_todo}</span></td>
                    <td><h2 className="value text-danger">={counts.mailstodo}</h2></td>
                  </tr> 
                  <tr>
                    <th style={{width: "94px"}}><span className="label count-span">Remaining</span></th>
                    <td><span>: {counts.first_remains}+{counts.second_remains}+{counts.third_remains}+{counts.fourth_remains}</span></td>
                    <td><h2 className="value text-danger">={counts.mailstobesent}</h2></td>
                  </tr>             
                </div>
              </div>
            </div>
          </div>

          {/* ---- EMPLOYEE OVERVIEW ---- */}
          {/* <h4 className="mt-5 mb-3">Employee Overview</h4>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-info">🧑‍💼</div>
                <div className="card-sec">
                  <span className="label count-span">Active Employees: <h2 className="value text-info">{counts.activeEmployees}</h2></span>
                  <span className="label count-span">Inactive Employees: <h2 className="value text-secondary">{counts.inactiveEmployees}</h2></span>
                  
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-secondary">🔴</div>
                <div className="card-sec">
                  <span className="label count-span">Inactive Employees: <h2 className="value text-secondary">{counts.inactiveEmployees}</h2></span>
                  
                </div>
              </div>
            </div>
          </div> */}

          {/* ---- NEW EMPLOYEE WORK PROGRESS SECTION ---- */}
          <h4 className="mt-5 mb-4 ">Employee Work Progress</h4>

          <div className="row g-4 overflow-y-auto emp-pro-sec" >
            {employeeStats.map((emp, index) => (
              <div key={index} className="col-md-4">
                <div className="shadow p-3">
                  <h6 className="fw-bold">{emp.emp_name}
                    {/* -<span style={{fontSize: "10px"}}>{emp.emp_designation}</span> */} </h6> 
                  <tr>
                    <td><div>🏢 Registered Companies </div></td>
                    <td><b> : {emp.totalCompanies}</b></td>
                  </tr>
                  <tr>
                    <td><div>📝 Today's Follow ups </div></td>
                    <td><b> : {emp.todo}</b></td>
                  </tr>
                  <tr>
                    <td><div>⏳ Total Pending</div></td>
                    <td><b className="text-danger"> : {emp.pending}</b></td>
                  </tr>
                  
                  
                  
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
