import React, { useEffect } from 'react'
import axios from 'axios'
import '../../assets/css/styles.css'

export default function Candidates() {
    const [candidates, setCandidates] = React.useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/api/candidates')
            .then(response => {
                setCandidates(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the candidates!', error);
            })
    }, []);
    console.log(candidates)

    //FORMAT DATES
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        // return new Date(date).toISOString().slice(0, 10); formal

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth()+1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    return (
        <div>
            <div className=' justify-content-center align-items-center min-vh-100 w-100 m-0'>
                <div className='d-flex justify-content-between align-items-center '>
                    <h3>Comapanies</h3>
                    <select name="" id="">
                        <option value="">PENDING</option>
                        <option value="">UNREACHABLE</option>
                        <option value="">DONE</option>
                    </select>
                </div>

                <div className="table-wrapper mt-4">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>id</th>
                                <th>comp_domain</th>
                                <th>comp_name</th>
                                <th>website</th>
                                <th>email</th>
                                <th>phone</th>
                                <th>date_of_register</th>
                                <th>first_f_date</th>
                                <th>first_f_status</th>
                                <th>second_f_date</th>
                                <th>second_f_status</th>
                                <th>third_f_date</th>
                                <th>third_f_status</th>
                                <th>fourth_f_date</th>
                                <th>fourth_f_status</th>
                                <th>final_status</th>
                                <th>assigned_emp_id</th>
                                <th>emp_name</th>
                                <th>country_id</th>
                                <th>country_name</th>
                            </tr>
                        </thead>

                        <tbody>
                            {candidates.map((candidate) => (
                                <tr key={candidate.candidate_id}>
                                    <td>{candidate.candidate_id}</td>
                                    <td>{candidate.comp_domain}</td>
                                    <td>{candidate.comp_name}</td>
                                    <td>
                                        <a href={`https://${candidate.website}`} target="_blank" rel="noreferrer">
                                                {candidate.website}
                                            </a>
                                    </td>
                                    <td>{candidate.email}</td>
                                    <td>{candidate.phone}</td>
                                    <td>{formatDate(candidate.date_of_register)}</td>
                                    <td>{formatDate(candidate.first_f_date)}</td>
                                    <td>{candidate.first_f_status}</td>
                                    <td>{formatDate(candidate.second_f_date)}</td>
                                    <td>{candidate.second_f_status}</td>
                                    <td>{formatDate(candidate.third_f_date)}</td>
                                    <td>{candidate.third_f_status}</td>
                                    <td>{formatDate(candidate.fourth_f_date)}</td>
                                    <td>{candidate.fourth_f_status}</td>
                                    <td>{candidate.final_status}</td>
                                    <td>{candidate.assigned_emp_id}</td>
                                    <td>{candidate.emp_name}</td>
                                    <td>{candidate.country_id}</td>
                                    <td>{candidate.country_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    )
}
