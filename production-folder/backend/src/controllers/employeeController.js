const db = require('../config/db');

exports.addEmployee = (req, res) => {

    const { name, designation, login_role, email, password } = req.body;

    // Validate 
    if (!name || !designation || !login_role || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const checkMail = `SELECT email FROM emp WHERE email = ?`;

    db.query(checkMail, [email], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Database Error" });
        }

        // Email already exists
        if (results.length > 0) {
            return res.status(409).json({
                message: "Employee already exist"
            });
        }

        // Insert new employee
        const sql = `
            INSERT INTO emp (emp_name, emp_designation, login_role, email, password)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [name, designation, login_role, email, password], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Database Insert Failed" });
            }

            return res.status(201).json({
                message: "Employee added successfully",
                employeeId: result.insertId
            });
        });
    });
};
