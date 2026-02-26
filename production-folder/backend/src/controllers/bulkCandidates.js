const db = require("../config/db");

/* =========================
   REQUIRED (NON-NULL) FIELDS
========================= */
const requiredFields = [
  "domain",
  "name",
  "website",
  "email",
  "phone",
  "firstStatus",
  "secondStatus",
  "thirdStatus",
  "fourthStatus",
  "finalStatus",
  "empID",
  "empName",
  "countryId",
  "countryName"
];

/* =========================
   DATE VALIDATOR
========================= */
const isValidDate = (date) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

/* =========================
   BULK INSERT CONTROLLER
========================= */
exports.bulkCandidates = async (req, res) => {
  try {
    const companies = req.body.data;

    console.log("Bulk insert payload:", companies);

    if (!Array.isArray(companies) || companies.length === 0) {
      return res.status(400).json({ message: "No data received" });
    }

    /* ---------- VALIDATION ---------- */
    for (let i = 0; i < companies.length; i++) {
      const row = companies[i];

      // Required fields
      for (const field of requiredFields) {
        if (row[field] === undefined || row[field] === "") {
          return res.status(400).json({
            message: `Row ${i + 1}: Missing required field '${field}'`
          });
        }
      }

      // Optional date fields
      const dateFields = [
        "dateReg",
        "firstFollow",
        "secondFollow",
        "thirdFollow",
        "fourthFollow"
      ];

      for (const df of dateFields) {
        if (
          row[df] !== null &&
          row[df] !== undefined &&
          !isValidDate(row[df])
        ) {
          return res.status(400).json({
            message: `Row ${i + 1}: Invalid date format in '${df}' → ${row[df]}`
          });
        }
      }

      // Email
      if (!/^\S+@\S+\.\S+$/.test(row.email)) {
        return res.status(400).json({
          message: `Row ${i + 1}: Invalid email '${row.email}'`
        });
      }

      // Phone
      if (row.phone && row.phone.length < 3) {
        return res.status(400).json({
          message: `Row ${i + 1}: Phone number '${row.phone}' is too short`
        });
      }

      // Numeric checks
      if (isNaN(Number(row.empID))) {
        return res.status(400).json({
          message: `Row ${i + 1}: empID is not numeric (${row.empID})`
        });
      }

      if (isNaN(Number(row.countryId))) {
        return res.status(400).json({
          message: `Row ${i + 1}: countryId is not numeric (${row.countryId})`
        });
      }
    }

    /* ---------- BULK INSERT ---------- */
    const values = companies.map(c => [
      c.domain,
      c.name,
      c.website,
      c.email,
      c.phone,
      c.dateReg || null,
      // c.firstFollow || null,
      c.firstStatus,
      // c.secondFollow || null,
      c.secondStatus,
      // c.thirdFollow || null,
      c.thirdStatus,
      // c.fourthFollow || null,
      c.fourthStatus,
      c.finalStatus,
      c.empID,
      c.empName,
      c.countryId,
      c.countryName
    ]);

    const query = `
      INSERT INTO candidates
      (comp_domain, comp_name, website, email, phone, date_of_register,
       first_f_status,
       second_f_status,
       third_f_status,
       fourth_f_status,
       final_status, assigned_emp_id, emp_name, country_id, country_name)
      VALUES ?
    `;

   db.query(query, [values]);

    return res.json({
      message: "Bulk insert successful",
      count: companies.length
    });

  } catch (err) {
    console.error("🔥 Bulk Insert Error:", err);
    return res.status(500).json({
      message: err.sqlMessage || err.message
    });
  }
};
