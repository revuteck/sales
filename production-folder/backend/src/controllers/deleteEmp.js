const db = require("../config/db");

exports.deleteEmp = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Check if employee has candidates
    const [rows] = await db.promise().query(
      "SELECT COUNT(*) AS count FROM candidates WHERE assigned_emp_id = ?",
      [id]
    );

    if (rows[0].count > 0) {
      return res.status(400).json({
        message: "Cannot delete employee. Candidates are assigned to this employee."
      });
    }

    // ✅ Safe to delete
    const [result] = await db.promise().query(
      "DELETE FROM emp WHERE emp_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });

  } catch (err) {
    console.error("Delete employee error:", err);
    res.status(500).json({ message: err.message });
  }
};
