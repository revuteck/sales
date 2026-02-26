const db = require("../config/db");

const editCandidate = async (req, res) => {
  try {
    const { id } = req.params; // candidate_id
    const {
      comp_name,
      comp_domain,
      website,
      email,
      phone
    } = req.body;

    // 🔐 Basic validation
    if (!comp_name || !email) {
      return res.status(400).json({
        message: "Company name and email are required"
      });
    }

    // 🔍 Check candidate exists
    const [exists] = await db.promise().query(
      "SELECT candidate_id FROM candidates WHERE candidate_id = ?",
      [id]
    );

    if (exists.length === 0) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    // ✅ Update candidate
    await db.promise().query(
      `UPDATE candidates
       SET
         comp_name = ?,
         comp_domain = ?,
         website = ?,
         email = ?,
         phone = ?
       WHERE candidate_id = ?`,
      [
        comp_name,
        comp_domain,
        website,
        email,
        phone,
        id
      ]
    );

    res.json({
      success: true,
      message: "Candidate updated successfully"
    });

  } catch (error) {
    console.error("Edit Candidate Error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = editCandidate;
