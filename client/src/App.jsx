import { useState } from 'react'
import {Navigate} from 'react-router-dom'
import './App.css'
import './assets/css/styles.css'
import Login from './pages/login'
import SuperAdminDashboard from './dashboards/superAdminDashboard'
import HrDashboard from './dashboards/hrDashboard'
import AdminDashboard from './dashboards/adminDashboard'
import Admin_Dash from './components/AdminComps/dashboard'
import { Routes, Route } from "react-router-dom";
import AllCandidates from './components/AdminComps/Candidates'
import Employee from './components/SuperAdminComps/getEmp';
import AllPendings from './components/SuperAdminComps/pendings';
import AllTodoList from './components/AdminComps/TodoList';
import AdminCandidates from './components/AdminComps/Candidates'
import Emp_Dash from './components/EmployeeComps/dashboard'
import Candidates from './components/EmployeeComps/Candidates'
import Pendings from './components/EmployeeComps/pendings'
import Todo from './components/EmployeeComps/TodoList'
function App() {
  return (
    <>
     
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        
        <Route path="/sales/dashboard" element={<HrDashboard />} />
        <Route path ="/candidates" element={<Candidates/>} />
        {/* HR ROUTINGS */}
        <Route path="/hr" element={<HrDashboard />}>
        <Route path='dashboard' element={<Emp_Dash/>} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route path = "candidates" element={<Candidates/>} />
        <Route path = "pendings" element={<Pendings/>} />
        <Route path = "todo" element={<Todo/>} />
        </Route>
        {/* ADMIN ROUTINGS */}
        <Route path = "/admin" element={<AdminDashboard />}>
        <Route path='dashboard' element={<Admin_Dash/>} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route path = "all-candidates" element={<AllCandidates/>} />
        <Route path='emps' element={<Employee />} />
        <Route path='all-pendings' element={<AllPendings/>} />
        <Route path='all-todo' element={<AllTodoList/>} />

        </Route>

      {/* <CANDIDATES></CANDIDATES> */}
      <Route path="candidates" element={< AdminCandidates/>} />
      </Routes>

    </>
  )
}

export default App;
