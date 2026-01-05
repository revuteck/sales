const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: ls-b9e1fff8ae66188406492f1b8709a5557d98a493.cvq4mo8ooiu8.ap-south-1.rds.amazonaws.com,
  user: dbmasteruser,
  password: Sales1221.,
  database: sales,
  port: 3306
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
