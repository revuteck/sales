import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FiChevronRight  } from "react-icons/fi";
import Swal from "sweetalert2";

export default function SuperAdminDashboard() {

  // const [view, setView] = useState("dashboard");
  // const [adminName, setadminName] = useState(null);
  const [activeLink, setActiveLink] = useState("dashboard");  // 👈 new state
  const navigate = useNavigate();
  // console.log(localStorage.getItem("name")+" SUper admin dahsboard::::")

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // const handleNavClick = (section) => {
  //   setView(section);
  //   setActiveLink(section); // highlight clicked one
  // };

  // Logout function
  const logoutHandle = () => {
  Swal.fire({
    title: "Log out?",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    width: 350,
    customClass: {
    popup: "compact-swal",
  },
  }).then((result) => {
    if (result.isConfirmed) {

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("id");

        navigate("/");
      }, 500); // ⏱️ 0.5 second delay
    }
  });
};


  return (
    <div className='d-flex  min-vh-100 w-100 m-0'>

      <div className="s-admin-dashboard-left">
        <div className="profile">{localStorage.getItem("name")} 
          <FiChevronRight 
            className="switch-icon"
            title="Switch to Employee Dashboard"
            onClick={() => navigate("/hr")}
          />
          <br />
          <span className="sub">{localStorage.getItem("email")}</span>
          


          {/* <p>Emp: {localStorage.getItem("name")}</p> */}
        </div>


        {/* Navigation */}
        <div className="navigation">
          <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="dashboard">Dashboard</NavLink>

          <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="all-candidates">Companies</NavLink>

          <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="all-todo"
          >TODO Lists</NavLink>
          {/* <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="all-mails-today-sent"
          >Today Sent Mails</NavLink> */}
       

          <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="all-sent-mails"
          >All Sent Mails</NavLink>
          <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="all-pendings"
          >Pendings</NavLink>
          <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="all-failed"
          >All Failed</NavLink>
          <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="emps">Employees</NavLink>
            <NavLink
            className={activeLink === "todolist" ? "active" : ""}
            to="countries">Countries</NavLink>
          <button className="logout" onClick={logoutHandle}>
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className='s-admin-dashboard-right'>
         <div className="content-area">
          <Outlet />
        </div>

        <footer className="app-footer">
          © All rights reserved to revuteck.in
        </footer>
      </div>
    </div>
  );
}
