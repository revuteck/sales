import { useEffect, useState } from "react";
import axios from "axios";
import Candidates from "./Candidates";

export default function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [counts, setCounts] = useState({
    total_todo: 0,
    candidates: 0,
    pending: 0
  });

  useEffect(() => {
    getCounts();
  }, []);

  const getCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const empId = Number(localStorage.getItem("id"));

      const isToday = (dateString) => {
        if (!dateString) return false;
        const d = new Date(dateString);
        const t = new Date();
        d.setHours(0, 0, 0, 0);
        t.setHours(0, 0, 0, 0);
        return d.getTime() === t.getTime();
      };

      const isPending = (dateString) =>{
        if(!dateString) return false;

        const d = new Date(dateString);
        const t = new Date();
        d.setHours(0, 0, 0, 0);
        t.setHours(0, 0, 0, 0);
        return d.getTime() < t.getTime();

      }
      const { data } = await axios.get("https://rev-comp-backend.onrender.com/api/candidates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // candidates assigned to login user
      const myCompanies = data.filter(c => c.assigned_emp_id === empId);

      // reusable function
      const filterTodo = (stageStatus, stageDate) =>
        data.filter(
          c => c.assigned_emp_id === empId &&
          c[stageStatus] === "PENDING" &&
          isToday(c[stageDate])
        );
      // grouped
      const first = filterTodo("first_f_status", "first_f_date");
      const second = filterTodo("second_f_status", "second_f_date");
      const third = filterTodo("third_f_status", "third_f_date");
      const fourth = filterTodo("fourth_f_status", "fourth_f_date");
          // count total pending follow-ups
      const totalTodo = first.length + second.length + third.length + fourth.length;

      //pendings
      const filterPending = (stageStatus, stageDate) =>
          data.filter(
            c => c.assigned_emp_id === Number(empId) &&
            c[stageStatus] === "PENDING" &&
            isPending(c[stageDate])
          )
          console.log(filterPending.data)

      const fir_pend = filterPending("first_f_status", "first_f_date");
      const sec_pend = filterPending("second_f_status", "second_f_date");
      const thir_pend = filterPending("third_f_status", "third_f_date");
      const four_pend = filterPending("fourth_f_status", "fourth_f_date");
      
        //total pendings
        const total_pendings = fir_pend.length + sec_pend.length + thir_pend.length + four_pend.length;


      setCounts({
        total_todo: totalTodo,
        candidates: myCompanies.length,
        pending: total_pendings
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
        <div className="container py-4">
          <h4 className="mb-4"> Dashboard Overview</h4>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="dash-card shadow" onClick={() => setView("candidates")}>
                <div className="icon bg-primary">👤</div>
                <div>
                  <span className="label">Total Companies</span>
                  <h2 className="value">{counts.candidates}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-success">📝</div>
                <div>
                  <span className="label">Today's Follow-ups</span>
                  <h2 className="value">{counts.total_todo}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="dash-card shadow">
                <div className="icon bg-danger">⏳</div>
                <div>
                  <span className="label">Total Pending</span>
                  <h2 className="value text-danger">{counts.pending}</h2>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
