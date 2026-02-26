const db = require('../config/db');
const jwt = require("jsonwebtoken");

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM emp WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, results) => {

        if (err) {
            console.log("Error during login", err);
            return res.status(500).json({
                message: "Database Server Error"
            });
        }

        if (results.length > 0) {

            const user = results[0];

            // Generate JWT with payload
            const token = jwt.sign(
                {
                    id: user.emp_id,  
                    name:user.emp_name,           // user id from database
                    email: user.email,
                    role: user.login_role    // stored role
                },
                "SECRET_KEY",               // Change to env variable later
                { expiresIn: "2h" }         // token expiry (optional)
            );

            return res.status(200).json({
                message: "Login Successful",
                token: token,  
                designation: user.login_role,
                email: user.email,
                emp_id : user.emp_id,
                emp_name: user.emp_name
            });
        } else {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }
    });
};
