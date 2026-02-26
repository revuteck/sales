const db = require("../config/db");

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params; // candidate_id from axios

    // ✅ Check candidate exists
    const [rows] = await db.promise().query(
      "SELECT candidate_id FROM candidates WHERE candidate_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    // ✅ Delete candidate
    const [result] = await db.promise().query(
      "DELETE FROM candidates WHERE candidate_id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Candidate deleted successfully"
    });

  } catch (err) {
    console.error("Delete Candidate error:", err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};
