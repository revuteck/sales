const db = require("../config/db");

exports.updateStatus = (req, res) => {
    const { ids, stage } = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "No candidate IDs provided" });
    }

    // Define stage mapping
    const stepMap = {
        first: { current: "first_f_status", next: "second_f_status" },
        second: { current: "second_f_status", next: "third_f_status" },
        third: { current: "third_f_status", next: "fourth_f_status" },
        fourth: { current: "fourth_f_status", next: null } // last stage
    };

    const step = stepMap[stage];

    if (!step) return res.status(400).json({ message: "Invalid stage value!" });

    let sql;

    if (step.next) {
        // Update current to DONE and unlock next stage
        sql = `
            UPDATE candidates 
            SET ${step.current} = 'DONE',
                ${step.next} = CASE WHEN ${step.next} = 'LOCKED' OR ${step.next} IS NULL THEN 'PENDING' ELSE ${step.next} END
            WHERE candidate_id IN (?) AND ${step.current} = 'PENDING';
        `;
    } else {
        // Final stage: Mark final as completed
        sql = `
            UPDATE candidates 
            SET ${step.current} = 'DONE', final_status='COMPLETED'
            WHERE candidate_id IN (?) AND ${step.current} = 'PENDING';
        `;
    }

    db.query(sql, [ids], (err, result) => {
        if (err) return res.status(500).json({ message: "Database update failed", error: err });

        res.status(200).json({
            message: "Status updated successfully",
            updatedRows: result.affectedRows
        });
    });
};
