const mysql = require('mysql2');
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database Connection Failed");
    } else {
        console.log("Database Connected from revu");
        connection.release();
    }
});

module.exports = db;
