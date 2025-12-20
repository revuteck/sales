import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddEmp from './AddEmp';
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";



export default function GetEmp() {

    const [employees, setEmployees] = useState([]);
    const [view, setView] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editRowId, setEditRowId] = useState(null);
    const [editData, setEditData] = useState({});

console.log(editData)
    const [selectedEmp, setSelectedEmp] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        axios.get("/api/employee/data")
            .then(res => setEmployees(res.data))
            .catch(err => console.error(err));
    };

    // DELETE EMPLOYEE
    const deleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `/api/employee/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("✅ Employee deleted successfully");
            fetchEmployees(); // reload list

        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message); // FK constraint message
            } else {
                alert("❌ Failed to delete employee");
            }

            console.error(error);
        }
    };
    //update emp
    const saveEmployee = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `/api/employee/update/${editRowId}`,
                editData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert("✅ Employee updated successfully");
            setEditRowId(null);
            setEditData({});
            fetchEmployees();

        } catch (error) {
            alert("❌ Failed to update employee");
            console.error(error);
        }
    };


    return (
        <div>
            <div className='justify-content-center align-items-center min-vh-100 w-100 m-0'>

                {/* HEADER */}
                <div className='d-flex justify-content-between align-items-center'>
                    <h5>Employee : <span className='label  count-badge'>{employees.length}</span></h5>

                    <button
                        onClick={() => {
                            setView('addemp');
                            setSelectedEmp(null);
                            setShowModal(true);
                        }}
                        className='btn btn-primary'
                        >
                        Add Emp
                    </button>
                </div>

                {/* TABLE */}
                <div className='mt-4 table-wrapper'
                    style={{ maxHeight: "580px", overflowY: "auto", overflowX: "hidden" }}>

                    <table className='table table-bordered table-hover'>
                        <thead className='table-dark'>
                            <tr>
                                <th style={{width: "10px"}}>Emp Id</th>
                                <th>Emp Name</th>
                                <th>Designation</th>
                                <th>Login Role</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th style={{width: "10px"}}>Edit</th>
                                <th style={{width: "10px"}}>Delete</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.emp_id}>

                                    <td>{emp.emp_id}</td>

                                    <td>
                                        {editRowId === emp.emp_id ? (
                                            <input
                                                value={editData.emp_name}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, emp_name: e.target.value })
                                                }
                                            />
                                        ) : (
                                            emp.emp_name
                                        )}
                                    </td>

                                    <td>
                                        {editRowId === emp.emp_id ? (
                                            <select
                                                value={editData.emp_designation}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        emp_designation: e.target.value
                                                    })
                                                }
                                                className=""
                                            >
                                                <option value="">Select Designation</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="HR">HR</option>
                                                <option value="Sales">Sales</option>
                                            </select>
                                        ) : (
                                            emp.emp_designation
                                        )}
                                    </td>


                                    <td>
                                        {editRowId === emp.emp_id ? (
                                            <select
                                                value={editData.login_role}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, login_role: e.target.value })
                                                }
                                            >
                                                <option value="admin">Admin Login</option>
                                                <option value="manager">Manager Login</option>
                                                <option value="hr">HR Login</option>
                                                <option value="sales">Sales Login</option>
                                            </select>
                                        ) : (
                                            emp.login_role
                                        )}
                                    </td>

                                    <td>
                                        {editRowId === emp.emp_id ? (
                                            <input
                                                value={editData.email}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, email: e.target.value })
                                                }
                                            />
                                        ) : (
                                            emp.email
                                        )}
                                    </td>

                                    <td>
                                        {editRowId === emp.emp_id ? (
                                            <input
                                                value={editData.password}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, password: e.target.value })
                                                }
                                            />
                                        ) : (
                                            emp.password
                                        )}
                                    </td>

                                    {/* EDIT / SAVE */}
                                    <td>
                                        {editRowId === emp.emp_id ? (
                                            <>
                                                <button
                                                    onClick={saveEmployee}
                                                    style={{ background: "green", color: "#fff", marginRight: "5px" }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditRowId(null)}
                                                    style={{ background: "gray", color: "#fff" }}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditRowId(emp.emp_id);
                                                    setEditData({ ...emp });
                                                }}
                                                style={{ background: "transparent", color: "#656565ff", width: "10px" }}
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                    </td>

                                    {/* DELETE */}
                                    <td>
                                        <button
                                            onClick={() => deleteEmployee(emp.emp_id)}
                                            style={{ background: "transparent ", color: "#eb8b8bff",width: "10px" }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

                {/* ADD + EDIT MODAL (same design) */}
                {(view === 'addemp' || view === 'editemp') && showModal && (
                    <div className="modal fade show"
                        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>

                        <div className="modal-dialog" style={{ maxWidth: "auto", width: "auto" }}>
                            <div className="model-content-sec">

                                {/* HEADER */}
                                <div className="d-flex justify-content-between align-items-center"
                                    style={{ padding: "10px 20px" }}>

                                    <h4 className="m-0">
                                        {view === "addemp" ? "Add Employee" : "Edit Employee"}
                                    </h4>

                                    <button
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}>
                                    </button>
                                </div>

                                {/* FORM (AddEmp also works for edit — pass data via props) */}
                                <AddEmp employeeData={selectedEmp} refresh={fetchEmployees} close={() => setShowModal(false)} />

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
