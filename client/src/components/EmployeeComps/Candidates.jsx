import React, { useEffect } from 'react'
import axios from 'axios'
import '../../assets/css/styles.css'
import AddComp from './addCandidate';
import UploadCSV from './uploadCSV';
import { useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { addFiveDays, addFourDays, addThreeDays, addTwoDays } from '../../utilities/ActualDates';


export default function Candidates() {
    const [candidates, setCandidates] = React.useState([]);
    const [selectedCandidate, setSelectedCandidate] = React.useState(null);
    const [view, setView] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);
    const [filterStatus, setFilterStatus] = React.useState("all");
    const [editCandidate, setEditCandidate] = React.useState(null);
    const [hoverCandidate, setHoverCandidate] = React.useState(null);
    const [countries, setCountries] = React.useState([]);
    const [searchCountry, setCountry] = useState("all")


    const empId = localStorage.getItem("id");
    useEffect(() => {
        axios.get(`http://localhost:5000/api/candidates/emp?empId=${empId}`)
            .then(response => {
                setCandidates(response.data.empId);
            })
            .catch(error => {
                console.error('There was an error fetching the candidates!', error);
            })
    }, [empId]);
    useEffect(() => {
        axios.get('http://localhost:5000/api/country/data')
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error('Error:', error)
            })
    }, [])
    // console.log(candidates)

    //FORMAT DATES
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        // return new Date(date).toISOString().slice(0, 10); formal

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const noFailedCandidates = candidates.filter(
        c => c.final_status !== "FAILED"
    )
    const filteredCandidates = noFailedCandidates.filter((c) => {
        const stateMatch = filterStatus === "all" ||
            c.final_status?.trim().toUpperCase() === filterStatus.toUpperCase();

        const countryMatch = searchCountry === "all" ||
            c.country_name === searchCountry;
        return stateMatch && countryMatch;
    });
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this company?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/candidates/delete/${id}`);

            // Remove from UI immediately
            setCandidates(prev =>
                prev.filter(c => c.candidate_id !== id)
            );
        } catch (error) {
            console.error(error);
            alert("Failed to delete company");
        }
    };
    const handleUpdate = async () => {
        try {
            const payload = {
                comp_name: editCandidate.comp_name,
                comp_domain: editCandidate.comp_domain,
                website: editCandidate.website,
                email: editCandidate.email,
                phone: editCandidate.phone
            };

            await axios.put(
                `http://localhost:5000/api/candidates/update/${editCandidate.candidate_id}`,
                payload
            );

            // Update UI instantly
            setCandidates(prev =>
                prev.map(c =>
                    c.candidate_id === editCandidate.candidate_id
                        ? { ...c, ...payload }
                        : c
                )
            );

            setShowModal(false);
            setEditCandidate(null);
            setView(null);
        } catch (error) {
            console.error(error);
            alert("Update failed");
        }
    };


    return (
        <div>
            <div className=' justify-content-center align-items-center min-vh-100 w-100 m-0'>
                <div className="d-flex justify-content-between align-items-center">
                    <h5>Companies : <span className='count-badge'>{filteredCandidates.length}</span></h5>

                    <div className='d-flex' id='tops'>
                        <div className="floating-field" style={{width:"125px"}}>
                            <button className="btn btn-primary"
                                onClick={() => {
                                    setView("uploadcsv");
                                    setShowModal(true);
                                }}
                            >
                                <span>
                                    <FaFileExcel
                                        size={20}
                                        color="white"
                                        style={{ marginTop: "-8px", marginLeft: "-8px" }}
                                    />

                                </span>
                                .CSV Upload</button>

                        </div>

                        {/* STATUS FILTER */}
                        <div className="floating-field">
                            <label className="floating-label">Country</label>

                            <select
                                className="form-control floating-select"
                                value={searchCountry}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                <option value="all">All</option>
                                {countries.map((c) => (
                                    c.status==="ACTIVE" &&
                                    <option key={c.country_name} value={c.country_name}>
                                        {c.country_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='floating-field'>
                            <label className='floating-label'>Status:</label>
                            <select
                                id="status"
                                className="form-control"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>

                        {/* ADD COMPANY BUTTON */}
                        <div className="ms-2">
                            <button
                                className="btn btn-success"
                                onClick={() => {
                                    setView("addcomp");
                                    setShowModal(true);
                                }}
                            >
                                Add Comp
                            </button>
                        </div>
                    </div>
                </div>

                <div className="table-wrapper mt-4"
                    style={{ maxHeight: "570px", overflowY: "auto", overflowX: "hidden" }}>
                    <table className="table table-bordered table-hover table-follow-ups">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: "2px" }}>No.</th>
                                {/* <th style={{ width: "10px" }}>id</th> */}
                                <th>Company Domain</th>
                                <th>Company Name</th>
                                <th>Website</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Registered Date</th>
                                <th>Emp</th>
                                <th>Country</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCandidates.map((candidate, index) => (
                                <tr key={candidate.candidate_id}
                                    style={{
                                        backgroundColor: candidate.first_f_status === "DONE" ? "#c8f7c5" : "red"
                                    }}
                                >
                                    <td className='td-wrap'>{index+1}</td>
                                    {/* <td className='td-wrap'>{candidate.candidate_id}</td> */}
                                    <td className='td-wrap'>{candidate.comp_domain}</td>
                                    <td className='td-wrap'>{candidate.comp_name}</td>

                                    <td className='td-wrap'>
                                        <a href={candidate.website} target="_blank" rel="noreferrer">
                                            {candidate.website}
                                        </a>
                                    </td>

                                    <td className='td-wrap'>{candidate.email}</td>
                                    <td className='td-wrap'>{candidate.phone}</td>
                                    <td className='td-wrap'>{formatDate(candidate.date_of_register)}</td>
                                    <td className='td-wrap'>{candidate.emp_name}</td>
                                    <td className='td-wrap'>{candidate.country_name}</td>
                                    <td style={{ width: "100px", padding: "20px" }} className='td-wrap'>
                                        <div className='stats-bolls-sec'>
                                            <span className='done'></span>
                                            <span className={candidate.first_f_status === "DONE" ? "done" : "pending"}></span>
                                            <span className={candidate.second_f_status === "DONE" ? "done" : "pending"}></span>
                                            <span className={candidate.third_f_status === "DONE" ? "done" : "pending"}></span>
                                            <span className={candidate.fourth_f_status === "DONE" ? "done" : "pending"}></span>
                                        </div>
                                    </td>

                                    <td
                                        className="td-wrap"
                                        style={{ width: "7%", whiteSpace: "nowrap" }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-between"
                                            style={{ gap: "4px" }}
                                        >
                                            {/* EDIT + DELETE (5%) */}
                                            <div className="d-flex" style={{ width: "5%", gap: "4px" }}>
                                                <button
                                                    className="btn btn-sm  p-1"
                                                    onClick={() => {
                                                        setEditCandidate({ ...candidate });
                                                        setView("edit");
                                                        setShowModal(true);
                                                    }}          
                                                >
                                                    <FaEdit className='edit-icon' />
                                                </button>


                                                <button
                                                    className="btn btn-sm  p-1"
                                                    onClick={() => handleDelete(candidate.candidate_id)}
                                                >
                                                    <FaTrash className="trash-icon" />

                                                </button>


                                            </div>

                                            {/* FOLLOW-UPS (5%) */}
                                            <button
                                                className="follow-up-btn"
                                                onClick={() => {
                                                    setSelectedCandidate(candidate);
                                                    setShowModal(true);
                                                    setView("followups");
                                                }}
                                                onMouseEnter={() => setHoverCandidate(candidate)}
                                                onMouseLeave={() => setHoverCandidate(null)}
                                            >
                                                <FaBell />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {hoverCandidate && (
                    <div className="followup-hover-card">
                        <div><strong>{hoverCandidate.email}</strong></div>
                        <hr />
                        
                        <div><strong>1st:</strong> {formatDate(hoverCandidate.first_f_date)} — {hoverCandidate.first_f_status}</div>
                        <div><strong>2nd:</strong> {formatDate(hoverCandidate.second_f_date)} — {hoverCandidate.second_f_status}</div>
                        <div><strong>3rd:</strong> {formatDate(hoverCandidate.third_f_date)} — {hoverCandidate.third_f_status}</div>
                        <div><strong>4th:</strong> {formatDate(hoverCandidate.fourth_f_date)} — {hoverCandidate.fourth_f_status}</div>
                        <hr />
                        <div><strong>Final:</strong> {hoverCandidate.final_status}</div>
                    </div>
                )}

                {/* FOLLOW-UPS MODAL */}
                {view === "followups" && showModal && selectedCandidate && (
                    <div className="modal fade show"
                        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>

                        <div className="modal-dialog" style={{ maxWidth: "auto", width: "auto" }}>

                            <div className="model-content-sec">

                                <div className="modal-header">
                                    <h6 className="modal-title">
                                        <strong>{selectedCandidate.email}</strong> - {selectedCandidate.emp_name}-{selectedCandidate.country_name}
                                    </h6>

                                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>

                                <div className="modal-body">
                                    <table className="table table-bordered" style={{ minWidth: "auto" }}>
                                        <tbody>
                                            <tr>
                                                <th>Stage</th>
                                                <th>Sent</th>
                                                <th>Actual</th>
                                                <th>Status</th>
                                            </tr>
                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>First Follow-up</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{formatDate(selectedCandidate.first_f_date)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{addTwoDays(selectedCandidate.date_of_register)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.first_f_status}</td>
                                            </tr>                                    
                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Second Follow-up</th>

                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}> {formatDate(selectedCandidate.second_f_date)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}> {addThreeDays(selectedCandidate.date_of_register)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.second_f_status}</td>

                                            </tr>
                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Third Follow-up</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{formatDate(selectedCandidate.third_f_date)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{addFourDays(selectedCandidate.date_of_register)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.third_f_status}</td>

                                            </tr>
                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Fourth Follow-up</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{formatDate(selectedCandidate.fourth_f_date)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{addFiveDays(selectedCandidate.date_of_register)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.fourth_f_status}</td>

                                            </tr>
                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Final Status</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.final_status}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>

                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
                {view === "edit" && showModal && editCandidate && (
                    <div className="modal fade show"
                        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>

                        <div className="modal-dialog">
                            <div className="model-content-sec">

                                <div className="modal-header">
                                    <h5>Edit Company</h5>
                                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>

                                <div className="modal-body">
                                    <input
                                        className="form-control mb-2"
                                        value={editCandidate.comp_domain}
                                        onChange={e =>
                                            setEditCandidate({ ...editCandidate, comp_domain: e.target.value })
                                        }
                                        placeholder="Company Domain"
                                    />
                                    <input
                                        className="form-control mb-2"
                                        value={editCandidate.comp_name}
                                        onChange={e =>
                                            setEditCandidate({ ...editCandidate, comp_name: e.target.value })
                                        }
                                        placeholder="Company Name"
                                    />



                                    <input
                                        className="form-control mb-2"
                                        value={editCandidate.website}
                                        onChange={e =>
                                            setEditCandidate({ ...editCandidate, website: e.target.value })
                                        }
                                        placeholder="Website"
                                    />

                                    <input
                                        className="form-control mb-2"
                                        value={editCandidate.email}
                                        onChange={e =>
                                            setEditCandidate({ ...editCandidate, email: e.target.value })
                                        }
                                        placeholder="Email"
                                    />

                                    <input
                                        className="form-control mb-2"
                                        value={editCandidate.phone}
                                        onChange={e =>
                                            setEditCandidate({ ...editCandidate, phone: e.target.value })
                                        }
                                        placeholder="Phone"
                                    />
                                </div>

                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-success" onClick={handleUpdate}>
                                        Update
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* ADD COMPANY MODAL */}
                {view === "addcomp" && showModal && (
                    <div className="modal fade show"
                        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>

                        <div className="modal-dialog" style={{ maxWidth: "auto", width: "auto" }}>
                            <div className="model-content-sec" style={{ position: "relative" }}>

                                <div className="d-flex justify-content-between align-items-center"
                                    style={{ padding: "10px 20px" }}>

                                    <h4 className="m-0">Add New Company</h4>

                                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>

                                <AddComp />
                            </div>
                        </div>

                    </div>
                )}
                {view === "uploadcsv" && showModal && (
                    <div className="modal fade show"
                        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>

                        <div className="modal-dialog" style={{ maxWidth: "auto", width: "auto" }}>
                            <div className="model-content-sec" style={{ position: "relative" }}>

                                <div className="d-flex justify-content-between align-items-center"
                                    style={{ padding: "10px 20px" }}>

                                    <h4 className="m-0">Add New Company</h4>

                                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>

                                <UploadCSV />
                            </div>
                        </div>

                    </div>
                )}


            </div>
        </div>
    )
}
