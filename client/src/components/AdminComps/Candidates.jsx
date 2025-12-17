import React, { useEffect } from 'react';
import axios from 'axios';
import AddComp from '../AdminComps/addCandidate';
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function Candidates() {

    const [candidates, setCandidates] = React.useState([]);
    const [selectedCandidate, setSelectedCandidate] = React.useState(null);
    const [view, setView] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);
    const [editCandidate, setEditCandidate] = React.useState(null);


    const [filterStatus, setFilterStatus] = React.useState("all");

    useEffect(() => {
        axios.get('https://rev-comp-backend.onrender.com/api/candidates')
            .then(response => {
                setCandidates(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the candidates!', error);
            });
    }, []);

    // FORMAT DATE
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // FILTER LOGIC
    const filteredCandidates = candidates.filter((c) => {
        if (filterStatus === "all") return true;
        return c.final_status === filterStatus;
    });
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this company?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`https://rev-comp-backend.onrender.com/api/candidates/delete/${id}`);

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
                `https://rev-comp-backend.onrender.com/api/candidates/update/${editCandidate.candidate_id}`,
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
            <div className="justify-content-center align-items-center min-vh-100 w-100 m-0" style={{ overflowY: "hidden" }}>

                {/* TOP BAR */}
                <div className="d-flex justify-content-between align-items-center">
                    <h3>Companies</h3>

                    <div className='d-flex' id='tops'>

                        {/* STATUS FILTER */}
                        <div>
                            {/* <label className='form-label form-lable-status'>Status:</label> */}
                            <select
                                id="status"
                                className="form-control"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
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

                {/* TABLE */}
                <div className="table-wrapper mt-4"
                    style={{ maxHeight: "580px", overflowY: "auto", overflowX: "hidden" }}>

                    <table className="table table-bordered table-hover table-follow-ups">
                        <thead className="table-dark" style={{ position: "sticky", top: 0, zIndex: 10 }}>
                            <tr>
                                <th style={{ width: '10px' }}>Id</th>
                                <th>Company Domain</th>
                                <th>Company Name</th>
                                <th>Website</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Registered Date</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCandidates.map((candidate) => (
                                <tr key={candidate.candidate_id}
                                    style={{
                                        backgroundColor:
                                            candidate.final_status === "COMPLETED" ? "#c8f7c5" : "transparent"
                                    }}
                                >
                                    <td className='td-wrap'>{candidate.candidate_id}</td>
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

                                    <td
                                        className="td-wrap"
                                        style={{ width: "10%", whiteSpace: "nowrap" }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-between"
                                            style={{ gap: "4px" }}
                                        >
                                            {/* EDIT + DELETE (5%) */}
                                            <div className="d-flex" style={{ width: "5%", gap: "4px" }}>
                                                <button
                                                    className="btn btn-sm btn-primary p-1"
                                                    onClick={() => {
                                                        setEditCandidate({ ...candidate });
                                                        setView("edit");
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>


                                                <button
                                                    className="btn btn-sm btn-danger p-1"
                                                    onClick={() => handleDelete(candidate.candidate_id)}
                                                >
                                                    <FaTrash />
                                                </button>


                                            </div>

                                            {/* FOLLOW-UPS (5%) */}
                                            <button
                                                style={{
                                                    width: "",
                                                    background: "linear-gradient(90deg,#2575fc,#6a11cb)",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    fontWeight: "400",
                                                    color: "#fff",
                                                    padding: "4px 6px",
                                                    fontSize: "12px",
                                                    whiteSpace: "nowrap"
                                                }}
                                                onClick={() => {
                                                    setSelectedCandidate(candidate);
                                                    setShowModal(true);
                                                    setView("followups");
                                                }}
                                            >
                                                Follow-Ups
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* FOLLOW-UPS MODAL */}
                {view === "followups" && showModal && selectedCandidate && (
                    <div className="modal fade show"
                        style={{ display: "block", background: "rgba(0,0,0,0.5)", margin: "0px" }}>

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
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>First Follow-up</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{formatDate(selectedCandidate.first_f_date)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.first_f_status}</td>
                                            </tr>
                                            {/* <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>First Follow-up Status</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.first_f_status}</td>
                                            </tr> */}

                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Second Follow-up</th>
                                                
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}> {formatDate(selectedCandidate.second_f_date)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.second_f_status}</td>
                                                
                                                    </tr>
                                            {/* <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Second Follow-up Status</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.second_f_status}</td>
                                            </tr> */}

                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Third Follow-up</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{formatDate(selectedCandidate.third_f_date)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.third_f_status}</td>

                                            </tr>
                                            {/* <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Third Follow-up Status</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.third_f_status}</td>
                                            </tr> */}

                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Fourth Follow-up</th>
                                                <td>{formatDate(selectedCandidate.fourth_f_date)}</td>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.fourth_f_status}</td>

                                            </tr>
                                            {/* <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Fourth Follow-up Status</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.fourth_f_status}</td>
                                            </tr> */}

                                            <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Final Status</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.final_status}</td>
                                            </tr>
                                            {/* <tr>
                                                <th style={{ width: "250px", whiteSpace: "nowrap" }}>Assigned Employee</th>
                                                <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.emp_name}</td>
                                            </tr> */}
                                                {/* <tr>
                                                    <th style={{ width: "250px", whiteSpace: "nowrap" }}>Country</th>
                                                    <td style={{ width: "250px", whiteSpace: "nowrap" }}>{selectedCandidate.country_name}</td>
                                                </tr> */}
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

            </div>
        </div>
    );
}
