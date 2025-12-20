import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Candidates from '../components/EmployeeComps/Candidates';
// import AddEmp from '../components/SuperAdminComps/AddEmp';
// import GetEmp from '../components/SuperAdminComps/getEmp';
// import Pendings from '../components/EmployeeComps/pendings';
// import Dashboard from '../components/EmployeeComps/dashboard'
// import AddCandidate from '../components/SuperAdminComps/addCandidate';
// import TodoList from '../components/EmployeeComps/TodoList';
import { FiChevronLeft } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";



export default function hrDashboard() {

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

  const handleNavClick = (section) => {
    setView(section);
    setActiveLink(section); // highlight clicked one
  };

  // Logout function
  const logoutHandle = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    navigate("/");
  };

  return (
    <div className='d-flex min-vh-100 w-100 m-0'>

      <div className="s-admin-dashboard-left">
        <div className="profile">{localStorage.getItem("name")} <br />
          <span className="sub">{localStorage.getItem("email")}</span>
          {localStorage.getItem("role") === "admin" && (
            <FiChevronLeft
              className="switch-icon"
              title="Back to Admin Dashboard"
              onClick={() => navigate("/admin")}
            />
          )}

        </div>


        {/* Navigation */}
        <div className="navigation">
           <NavLink
              className={activeLink === "todolist" ? "active" : ""}
              to="dashboard">Dashboard</NavLink>
            <NavLink
               className={activeLink === "todolist" ? "active" : ""}
                        to="candidates">Companies</NavLink>
            <NavLink
               className={activeLink === "todolist" ? "active" : ""}
                        to="todo">TODO Lists</NavLink>
            <NavLink
               className={activeLink === "todolist" ? "active" : ""}
                        to="pendings">Pendings</NavLink>
                    
          {/* <a
            href="#"
            className={activeLink === "dashboard" ? "active" : ""}
            onClick={() => handleNavClick("dashboard")}
          >
            Dashboard
          </a> */}

          {/* <a
            href="#"
            className={activeLink === "candidates" ? "active" : ""}
            onClick={() => handleNavClick("candidates")}
          >
            Companies
          </a> */}

          {/* <a 
            href="#" 
            className={activeLink === "employees" ? "active" : ""}
            onClick={() => handleNavClick("getEmp")}
          >
            Employees
          </a> */}

          {/* <a 
            href="#" 
            className={activeLink === "addemp" ? "active" : ""}
            onClick={() => handleNavClick("addemp")}
          >
            Add New Employee
          </a> */}

          {/* <a 
            href="#" 
            className={activeLink === "addcandidate" ? "active" : ""}
            onClick={() => handleNavClick("addcandidate")}
          >
            Add Company
          </a> */}

          {/* <a
            href="#"
            className={activeLink === "todolist" ? "active" : ""}
            onClick={() => handleNavClick("todolist")}
          >
            TODO Lists
          </a> */}

          {/* <a
            href="#"
            className={activeLink === "pendings" ? "active" : ""}
            onClick={() => handleNavClick("pendings")}
          >
            Pendings
          </a> */}

          <button className="logout" onClick={logoutHandle}>
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className='s-admin-dashboard-right'>
        <Outlet/>
        {/* {view === "dashboard" && <Dashboard />} */}
        {/* {view === "candidates" && <Candidates />} */}
        {/* {view === "addemp" && <AddEmp />} */}
        {/* {view === "getEmp" && <GetEmp />} */}
        {/* {view === "addcandidate" && <AddCandidate />}
        {view === "pendings" && <Pendings />}
        {view === "todolist" && <TodoList />} */}
      </div>
    </div>
  );
}
