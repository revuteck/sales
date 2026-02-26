const db = require("../config/db");

exports.getUndoStatus = (req, res) => {
  const { ids, stage } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0 || !stage) {
    return res.status(400).json({ message: "IDs array and Stage are required" });
  }

  // Map Stage
  const stageColumnMap = {
    First: "first_f_status",
    Second: "second_f_status",
    Third: "third_f_status",
    Fourth: "fourth_f_status",
  };

  const column = stageColumnMap[stage];

  if (!column) {
    return res.status(400).json({ message: "Invalid stage provided" });
  }

  const sql = `UPDATE candidates SET ${column}='PENDING' WHERE candidate_id IN (?)`;

  console.log("Undo Request:");
  console.log("IDs:", ids);
  console.log("Stage:", stage);

  db.query(sql, [ids], (err, result) => {
    if (err) {
      console.error("Error updating:", err);
      return res.status(500).json({ message: "Database error" });
    }

    return res.status(200).json({
      message: `${ids.length} records updated to PENDING`,
      updated_ids: ids,
      column,
    });
  });
};
