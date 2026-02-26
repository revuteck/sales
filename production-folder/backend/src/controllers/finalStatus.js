const db = require("../config/db");

exports.finalStatus = (req, res) => {
    const { ids, status } = req.body;
    console.log(typeof ids[0]);

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "No candidate IDs provided" });
    }

    const sql = `
        UPDATE candidates
        SET final_status = ?
        WHERE candidate_id IN (?)
    `;

    db.query(sql, [status, ids], (err, result) => {
        if (err) {
            console.error("Error updating final status:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        return res.status(200).json({
            message: "Final status updated successfully",
            updatedRows: result.affectedRows
        });
    });
};
