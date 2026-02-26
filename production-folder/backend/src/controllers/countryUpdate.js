const db = require('../config/db')

// Toggle Country Status
exports.getupdateStatus = (req, res) => {
    const { id, status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ message: "ID and status are required" });
    }

    const sql = `UPDATE countries SET status = ? WHERE country_id = ?`;

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Error updating status:", err);
            return res.status(500).json({ message: "Database error" });
        }

        return res.status(200).json({
            message: `Status updated to ${status}`,
            id,
            status,
        });
    });
};

