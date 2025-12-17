import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Third() {
    const [candidates, setCandidate] = useState([]);

    // ✅ Fetch all candidates once (super admin view)
    useEffect(() => {
        axios
            .get('https://rev-comp-backend.onrender.com/api/candidates')
            .then((response) => {
                setCandidate(response.data);
            })
            .catch((error) => {
                console.log('There was an error fetching candidates:' + error);
            });
    }, []);

    // ✅ FORMAT DATE (dd-mm-yyyy)
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // ✅ CHECK IF DATE IS BEFORE TODAY
    const isPastDate = (dateString) => {
        if (!dateString) return false;

        const today = new Date();
        const followUpDate = new Date(dateString);

        today.setHours(0, 0, 0, 0);
        followUpDate.setHours(0, 0, 0, 0);

        return followUpDate < today;
    };

    // ✅ All employees, third follow-up PENDING & date in past
    const pendingCandidates = candidates.filter(
        (candidate) =>
            isPastDate(candidate.third_f_date) &&
            candidate.third_f_status === 'PENDING'
    );

    return (
        <div>
            <div className="justify-content-center align-items-center min-vh-100 w-100 m-0">
                <div className="d-flex justify-content-between align-items-center ">
                    <h5>Third Follow Up Pending</h5>
                </div>

                <div className="table-wrapper mt-3 table-wrap">
                    <table className="table table-bordered table-hover table-follow-ups">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Domain</th>
                                <th>Company</th>
                                <th>Website</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Registered</th>
                                <th>3rd Follow-up</th>
                                <th>Status</th>
                                {/* <th>Emp ID</th> */}
                                <th>Emp Name</th>
                                {/* <th>Country ID</th> */}
                                <th>Country Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingCandidates.length > 0 ? (
                                pendingCandidates.map((candidate) => (
                                    <tr key={candidate.candidate_id}>
                                        <td className='td-wrap'>{candidate.candidate_id}</td>
                                        <td className='td-wrap'>{candidate.comp_domain}</td>
                                        <td className='td-wrap'>{candidate.comp_name}</td>
                                        <td className='td-wrap'>
                                            <a
                                                href={candidate.website}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {candidate.website}
                                            </a>
                                        </td>
                                        <td className='td-wrap'>{candidate.email}</td>
                                        <td className='td-wrap'>{candidate.phone}</td>
                                        <td className='td-wrap'>{formatDate(candidate.date_of_register)}</td>
                                        <td style={{ color: 'red', fontWeight: 'bold' }} className='td-wrap'>
                                            {formatDate(candidate.third_f_date)}
                                        </td>
                                        <td className='td-wrap'>{candidate.third_f_status}</td>
                                        {/* <td className='td-wrap'>{candidate.assigned_emp_id}</td> */}
                                        <td className='td-wrap'>{candidate.emp_name}</td>
                                        {/* <td className='td-wrap'>{candidate.country_id}</td> */}
                                        <td className='td-wrap'>{candidate.country_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" className="text-center text-muted">
                                        <strong>🎉 No Pending Follow Ups</strong>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
