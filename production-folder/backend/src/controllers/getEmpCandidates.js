const db = require('../config/db')
exports.getEmpCandidates = (req, res) =>{
    const empId = req.query.empId;
    console.log("from backend:", empId);
    const sql = `SELECT * FROM candidates where assigned_emp_id=?`;

    db.query(sql,[empId], (err, results)=>{
        if(err){
            console.log("Database error:" + err);
            return res.status(500).json({message: "Database failed!!"})
        }
        return res.status(201).json({
            message: "fetched suceesfully",
            empId: results
        })
    })
}