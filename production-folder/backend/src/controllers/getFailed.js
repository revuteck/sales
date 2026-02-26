const db = require("../config/db");

exports.getFailed = (req, res) => {
  const { 
    countryId, 
    countryName, 
    domain, 
    name, 
    website, 
    email, 
    phone, 
    empId,
    empName
  } = req.body;

  // Validate
  if (!domain || !name) {
    return res.status(400).json({ message: "Domain and Name are required" });
  }

  if (!countryId) {
    return res.status(400).json({ message: "Country is required" });
  }

  // Default values for FAILED company
  const final_status = "FAILED";
  const date_of_register = new Date();

  const sql = `
    INSERT INTO candidates 
    (
      country_id,
      country_name,
      comp_domain,
      comp_name,
      website,
      email,
      phone,
      date_of_register,
      first_f_status,
      second_f_status,
      third_f_status,
      fourth_f_status,
      final_status,
      assigned_emp_id,
      emp_name
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'PENDING', 'PENDING', 'PENDING', ?, ?, ?)
  `;

  const values = [
    countryId,
    countryName,
    domain,
    name,
    website || null,
    email || null,
    phone || null,
    date_of_register,
    final_status,
    empId,
    empName,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting FAILED company:", err);
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(200).json({
      message: "Failed company added successfully!",
      inserted_id: result.insertId,
    });
  });
};
