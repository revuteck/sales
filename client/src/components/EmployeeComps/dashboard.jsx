import { useEffect, useState } from "react";
import axios from "axios";
import Candidates from "./Candidates";

export default function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [counts, setCounts] = useState({
    total_todo: 0,
    candidates: 0,
    completedcomps: 0,
    pendingcomps: 0,
    mailspending: 0,
    totalmailstobesent: 0,
    totalpendings:0,
    first_pendings:0,
    second_pendings:0,
    third_pendings:0,
    fourth_pendings:0,
    first_remains:0,
    second_remains:0,
    third_remains:0,
    fourth_remains:0,
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
      const { data } = await axios.get("/api/candidates", {
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
        completedcomps: myCompanies.filter( c=> c.final_status === "COMPLETED").length,
        pendingcomps: myCompanies.filter(c => c.final_status === "PENDING").length,
        mailspending: total_pendings,
        totalmailstobesent: myCompanies.filter(c => c.first_f_status === "PENDING").length+
                            myCompanies.filter(c => c.second_f_status === "PENDING").length+
                            myCompanies.filter(c => c.third_f_status === "PENDING").length+
                            myCompanies.filter(c => c.fourth_f_status === "PENDING").length,
        first_remains: myCompanies.filter(c => c.first_f_status === "PENDING").length,
        second_remains: myCompanies.filter(c => c.second_f_status === "PENDING").length,
        third_remains: myCompanies.filter(c => c.third_f_status === "PENDING").length,
        fourth_remains: myCompanies.filter(c => c.fourth_f_status === "PENDING").length,
        totalpendings: myCompanies.filter(c => c.first_f_status === "PENDING" && isPending(c.first_f_date)).length +
                       myCompanies.filter(c => c.second_f_status === "PENDING" && isPending(c.second_f_date)).length +
                       myCompanies.filter(c => c.third_f_status === "PENDING" && isPending(c.third_f_date)).length +
                       myCompanies.filter(c => c.fourth_f_status === "PENDING" && isPending(c.fourth_f_date)).length,
        first_pendings:myCompanies.filter(c => c.first_f_status === "PENDING" && isPending(c.first_f_date)).length,
        second_pendings: myCompanies.filter(c => c.second_f_status === "PENDING" && isPending(c.second_f_date)).length,
        third_pendings:myCompanies.filter(c => c.third_f_status === "PENDING" && isPending(c.third_f_date)).length,
        fourth_pendings:myCompanies.filter(c => c.fourth_f_status === "PENDING" && isPending(c.fourth_f_date)).length
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
              <div className="dash-card shadow" onClick={() => setView("")}>
                <div className="icon bg-primary">👤</div>
                <div className="card-sec">
                  
                  <tr>
                    <th style={{width: "113px"}}><span className="label count-span">Total Companies</span></th>
                    <td><h2 className="value">: {counts.candidates}</h2></td>
                  </tr>

                  <tr>
                    <th style={{width: "113px"}}><span className="label count-span">Total Pendings </span></th>
                    <td><h2 className="value">: {counts.pendingcomps}</h2></td>
                  </tr>

                  <tr>
                    <th style={{width: "113px"}}><span className="label count-span">Total Completed </span></th>
                    <td><h2 className="value">: {counts.completedcomps}</h2></td>
                  </tr>
                  
                  
                  
                  
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
                  <tr>
                    <th style={{width: "94px"}}><span className="label count-span">Total Mails</span></th>
                    <td> <h2 className="value text-danger">: {counts.candidates*4}</h2></td>
                  </tr>
                  <tr>
                    <th style={{width: "94px"}}><span className="label count-span">Remainings</span></th>
                    <td><span>: {counts.first_remains}+{counts.second_remains}+{counts.third_remains}+{counts.fourth_remains}</span></td>
                    <td><h2 className="value text-danger">={counts.totalmailstobesent}</h2></td>
                  </tr>
                  <tr>
                    <th style={{width: "94px"}}><span className="label count-span">Pendings</span></th>
                    <td><span>: {counts.first_pendings}+{counts.second_pendings}+{counts.third_pendings}+{counts.fourth_pendings}</span>
                    </td>
                    <td><h2 className="value text-danger">={counts.totalpendings}</h2></td>
                  </tr>
                  
                  
                  
                  
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
