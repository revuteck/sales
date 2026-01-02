import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {isTomorrow} from '../../utilities/Dates'

import Candidates from "./Candidates";

export default function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [candidates, setCandidates] = useState([])
  const [activeLink, setActiveLink] = useState("dashboard");  // 👈 new state
  const navigate = useNavigate();



  const [counts, setCounts] = useState({
    total_todo: 0,
    candidates: 0,
    completedcomps: 0,
    pendingcomps: 0,
    mailspending: 0,
    totalmailstobesent: 0,
    totalpendings: 0,
    first_pendings: 0,
    second_pendings: 0,
    third_pendings: 0,
    fourth_pendings: 0,
    first_remains: 0,
    second_remains: 0,
    third_remains: 0,
    fourth_remains: 0,
    first_completed: 0,
    second_completed: 0,
    third_completed: 0,
    fourth_completed: 0,
    first_senttoday: 0,
    second_senttoday: 0,
    third_senttoday: 0,
    fourth_senttoday: 0,
    
  });

  const tomorrowCounts = {
  first_tmr: 0,
  second_tmr: 0,
  third_tmr: 0,
  fourth_tmr: 0,
};

  useEffect(() => {
    getCounts();
  }, []);

  //sent mails filter
  /* ================= FORMAT DATE ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };
  const Today = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const t = new Date();
    d.setHours(0, 0, 0, 0);
    t.setHours(0, 0, 0, 0);
    return d.getTime() === t.getTime();
  };


  // (c.second_f_status === "DONE" && Today(c.second_done_dt))
  // (c.third_f_status === "DONE" && Today(c.third_done_dt)) ||
  // (c.fourth_f_status === "DONE" && Today(c.fourth_done_dt))

  const getStageDoneToday = (c) => {
    if (c.first_f_status === "DONE" && Today(c.first_done_dt)) return "First";
    if (c.second_f_status === "DONE" && Today(c.second_done_dt)) return "Second";
    if (c.third_f_status === "DONE" && Today(c.third_done_dt)) return "Third";
    if (c.fourth_f_status === "DONE" && Today(c.fourth_done_dt)) return "Fourth";
    return "";
  };

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

      const isPending = (dateString) => {
        if (!dateString) return false;

        const d = new Date(dateString);
        const t = new Date();
        d.setHours(0, 0, 0, 0);
        t.setHours(0, 0, 0, 0);
        return d.getTime() < t.getTime();

      }
      const { data } = await axios.get("http://localhost:5000/api/candidates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // candidates assigned to login user
      const myCompanies = data.filter(c => c.assigned_emp_id === empId);
      setCandidates(myCompanies)
        myCompanies.forEach(c => {
    if (isTomorrow(c.first_f_date) && c.first_f_status === "PENDING") {
      tomorrowCounts.first_tmr++;
    }
    if (isTomorrow(c.second_f_date) && c.second_f_status === "PENDING") {
      tomorrowCounts.second_tmr++;
    }
    if (isTomorrow(c.third_f_date) && c.third_f_status === "PENDING") {
      tomorrowCounts.third_tmr++;
    }
    if (isTomorrow(c.fourth_f_date) && c.fourth_f_status === "PENDING") {
      tomorrowCounts.fourth_tmr++;
    }
  });

      // reusable function
      const filterTodo = (stageStatus, stageDate, prevStatus) =>
        data.filter(
          c => c.assigned_emp_id === empId &&
            c[stageStatus] === "PENDING" && c[prevStatus] === "DONE" &&
            isToday(c[stageDate])
        );
      // grouped
      const first = filterTodo("first_f_status", "first_f_date", "initial_status");
      const second = filterTodo("second_f_status", "second_f_date", "first_f_status");
      const third = filterTodo("third_f_status", "third_f_date", "second_f_status");
      const fourth = filterTodo("fourth_f_status", "fourth_f_date", "third_f_status");
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
        completedcomps: myCompanies.filter(c => c.final_status === "COMPLETED").length,
        pendingcomps: myCompanies.filter(c => c.final_status === "PENDING").length,
        mailspending: total_pendings,
        totalmailstobesent: myCompanies.filter(c => c.first_f_status === "PENDING").length +
          myCompanies.filter(c => c.second_f_status === "PENDING").length +
          myCompanies.filter(c => c.third_f_status === "PENDING").length +
          myCompanies.filter(c => c.fourth_f_status === "PENDING").length,
        first_remains: myCompanies.filter(c => c.first_f_status === "PENDING").length,
        second_remains: myCompanies.filter(c => c.second_f_status === "PENDING").length,
        third_remains: myCompanies.filter(c => c.third_f_status === "PENDING").length,
        fourth_remains: myCompanies.filter(c => c.fourth_f_status === "PENDING").length,
        totalpendings: myCompanies.filter(c => c.first_f_status === "PENDING" && isPending(c.first_f_date)).length +
          myCompanies.filter(c => c.second_f_status === "PENDING" && isPending(c.second_f_date)).length +
          myCompanies.filter(c => c.third_f_status === "PENDING" && isPending(c.third_f_date)).length +
          myCompanies.filter(c => c.fourth_f_status === "PENDING" && isPending(c.fourth_f_date)).length,
        first_pendings: myCompanies.filter(c => c.first_f_status === "PENDING" && isPending(c.first_f_date)).length,
        second_pendings: myCompanies.filter(c => c.second_f_status === "PENDING" && isPending(c.second_f_date)).length,
        third_pendings: myCompanies.filter(c => c.third_f_status === "PENDING" && isPending(c.third_f_date)).length,
        fourth_pendings: myCompanies.filter(c => c.fourth_f_status === "PENDING" && isPending(c.fourth_f_date)).length,
        first_completed: myCompanies.filter(c => c.first_f_status === "DONE").length,
        second_completed: myCompanies.filter(c => c.second_f_status === "DONE").length,
        third_completed: myCompanies.filter(c => c.third_f_status === "DONE").length,
        fourth_completed: myCompanies.filter(c => c.fourth_f_status === "DONE").length,
        first_senttoday: myCompanies.filter(c => c.first_f_status === "DONE" && Today(c.first_done_dt)).length,
        second_senttoday: myCompanies.filter(c => c.second_f_status === "DONE" && Today(c.second_done_dt)).length,
        third_senttoday: myCompanies.filter(c => c.third_f_status && Today(c.third_done_dt)).length,
        fourth_senttoday: myCompanies.filter(c => c.fourth_f_status && Today(c.fourth_done_dt)).length,
        first_tmr: tomorrowCounts.first_tmr,
        second_tmr: tomorrowCounts.second_tmr,
        third_tmr: tomorrowCounts.third_tmr,
        fourth_tmr: tomorrowCounts.fourth_tmr


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
        <div className="container ">
          <h4 className="mb-2">Employee Dashboard Overview</h4>

          <div className="row g-4">

            <div className="col-md-4">

              <div className="dash-card shadow mt-1" onClick={() => setView("")}>
                <div className="icon bg-primary">👤</div>
                <div className="card-sec">
                  {/* <span className="tag-label">Companies</span> */}
                  <NavLink
                    to="../candidates"
                    className={({ isActive }) =>
                      isActive ? "tag-label active" : "tag-label"
                    }
                  >
                    Companies
                  </NavLink>

                  <tr>
                    <th style={{ width: "113px" }}><span className="label count-span">Total </span></th>
                    <td><h2 className="value">: {counts.candidates}</h2></td>
                  </tr>

                  <tr>
                    <th style={{ width: "113px" }}><span className="label count-span"> Pendings </span></th>
                    <td><h2 className="value">: {counts.pendingcomps}</h2></td>
                  </tr>

                  <tr>
                    <th style={{ width: "113px" }}><span className="label count-span"> Completed </span></th>
                    <td><h2 className="value">: {counts.completedcomps}</h2></td>
                  </tr>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              {/* <span className="tag-label">TODO</span> */}
              <div className="dash-card shadow mt-1">
                <div className="icon bg-success">📝</div>
                <div className="card-sec">
                  <NavLink
                    to="../todo"
                    className={({ isActive }) =>
                      isActive ? "tag-label active" : "tag-label"
                    }
                  >
                    TODO
                  </NavLink>

                  <tr>
                    <th colSpan="8">
                      <span className="label">Today's</span>
                    </th>
                    <td>
                      <h2 className="value">: {counts.total_todo}</h2>
                    </td>
                  </tr>
                  <tr>
                    <th colSpan="8">
                      <span className="label">Today sent</span>
                    </th>
                    <td>
                      <span className="">: {counts.first_senttoday}+{counts.second_senttoday}+{counts.third_senttoday}+{counts.fourth_senttoday}</span>
                    </td>
                    <td>
                      <h2 className="value">={counts.first_senttoday + counts.second_senttoday + counts.third_senttoday + counts.fourth_senttoday}</h2>
                    </td>
                  </tr>
                  <tr>
                    <th colSpan="8">
                      <span className="label">Tomorrow's Mails</span>
                    </th>
                    <td>
                      <span className="">: {counts.first_tmr}+{counts.second_tmr}+{counts.third_tmr}+{counts.fourth_tmr}</span>
                    </td>
                    <td>
                      <h2 className="value">={counts.first_tmr + counts.second_tmr + counts.third_tmr + counts.fourth_tmr}</h2>
                    </td>
                  </tr>

                </div>
              </div>
            </div>

            <div className="col-md-4">

              <div className="dash-card shadow mt-1">

                <div className="icon bg-danger">⏳ </div>

                <div>
                  <span className="tag-label">Mails</span>
                  <tr>
                    <th style={{ width: "94px" }}><span className="label count-span">Total</span></th>
                    <td> <h2 className="value text-danger">: {counts.candidates * 4}</h2></td>
                  </tr>
                  <tr>
                    <th style={{ width: "94px" }}><span className="label count-span">Remainings</span></th>
                    <td><span>: {counts.first_remains}+{counts.second_remains}+{counts.third_remains}+{counts.fourth_remains}</span></td>
                    <td><h2 className="value text-danger">={counts.totalmailstobesent}</h2></td>
                  </tr>
                  <tr>
                    <th style={{ width: "94px" }}><span className="label count-span">Pendings</span></th>
                    <td><span>: {counts.first_pendings}+{counts.second_pendings}+{counts.third_pendings}+{counts.fourth_pendings}</span>
                    </td>
                    <td><h2 className="value text-danger">={counts.totalpendings}</h2></td>
                  </tr>
                  <tr>
                    <th style={{ width: "94px" }}><span className="label count-span">Completed</span></th>
                    <td><span>: {counts.first_completed}+{counts.second_completed}+{counts.third_completed}+{counts.fourth_completed}</span>
                    </td>
                    <td><h2 className="value text-danger">={counts.first_completed + counts.second_completed + counts.third_completed + counts.fourth_completed}</h2></td>
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
