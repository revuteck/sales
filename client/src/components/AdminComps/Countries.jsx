import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Countries() {
    const [countries, setCountries] = useState([]);
    const [searchCountry, setSearchCountry] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Fetch Countries
    const fetchCountries = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/country/data");
            setCountries(res.data);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    /* ---------------- FILTER LOGIC ---------------- */
    const filteredCountries = countries.filter((c) => {
        // Search Filter (country name)
        const matchesSearch = c.country_name
            .toLowerCase()
            .includes(searchCountry.toLowerCase());

        // Status filter
        const matchesStatus =
            filterStatus === "all"
                ? true
                : c.status.toUpperCase() === filterStatus.toUpperCase();

        return matchesSearch && matchesStatus;
    });
    // ----------------change status of cntry----------------
    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        try {
            await axios.put("http://localhost:5000/api/country/update-status", {
                id,
                status: newStatus,
            });

            // Refresh table after update
            fetchCountries();

        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to update status");
        }
    };

    return (
        <div>
            <div
                className="justify-content-center align-items-center min-vh-100 w-100 m-0"
                style={{ overflowY: "hidden" }}
            >
                <div className="d-flex justify-content-between align-items-center">
                    <h5>
                        Countries :
                        <span className="count-badge"> {filteredCountries.length}</span>
                    </h5>

                    <div className="d-flex" id="tops">

                        {/* SEARCH INPUT */}
                        <div className="floating-field me-2">
                            <label className="floating-label"></label>
                            <input
                                type="text"
                                className="form-control floating-select"
                                placeholder="Enter country name"
                                value={searchCountry}
                                onChange={(e) => setSearchCountry(e.target.value)}
                            />
                        </div>

                        {/* STATUS FILTER */}
                        <div className="floating-field">
                            <label className="floating-label">Status:</label>
                            <select
                                id="status"
                                className="form-control floating-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div
                    className="table-wrapper mt-4"
                    style={{ maxHeight: "570px", overflowY: "auto", overflowX: "hidden" }}
                >
                    <table className="table table-bordered table-hover table-follow-ups">
                        <thead
                            className="table-dark"
                            style={{ position: "sticky", top: 0, zIndex: 10 }}
                        >
                            <tr>
                                <th style={{ width: "10px" }}>Id</th>
                                <th>Name</th>
                                <th>ISO3</th>
                                <th>Ph Code</th>
                                <th>Capital</th>
                                <th>Currency</th>
                                <th>Region</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCountries.map((c) => (
                                <tr
                                    key={c.country_id}
                                    style={{
                                        backgroundColor:
                                            c.status.trim().toUpperCase() === "ACTIVE"
                                                ? "#185b13ff"
                                                : "red",
                                    }}
                                >
                                    <td>{c.country_id}</td>
                                    <td>{c.country_name}</td>
                                    <td>{c.iso3}</td>
                                    <td>{c.phonecode}</td>
                                    <td>{c.capital}</td>
                                    <td>{c.currency}</td>
                                    <td>{c.region}</td>

                                    <td className="d-flex justify-content-between align-items-center">

                                        {/* STATUS TEXT */}
                                        <span>{c.status}</span>

                                        {/* TOGGLE BUTTON */}
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => toggleStatus(c.country_id, c.status)}
                                        >
                                            Toggle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}
