const mysql = require("mysql2");
require("dotenv").config();

// const db = mysql.createPool({
//   host: "localhost",
//   user: "u122144590_clientsales",
//   password: "Revuteck@2101.",
//   database: "u122144590_clientsales",
//   port: 3306,
// });

const db = mysql.createPool({
  host: "localhost",
  user: "u122144590_clientsales",
  password: "Revuteck@2101.",
  database: "u122144590_clientsales",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
  } else {
    console.log("✅ Database Connected");
    connection.release();
  }
});

module.exports = db;
