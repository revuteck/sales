const db = require("../config/db");
exports.updateEmp = (req, res) =>{
    const {id} = req.params;
    const {emp_name, emp_designation, login_role, email, password } = req.body;
    console.log(emp_name, emp_designation, login_role, email, password);
     if (!id) {
    return res.status(400).json({ message: "Employee ID is required" });
  }
    const sql = `UPDATE  emp 
    SET emp_name=?, emp_designation=?, login_role =?, email=?, password=?
    WHERE emp_id = ? 
    `;
    db.query(sql, [emp_name, emp_designation, login_role, email, password, id ], (err,result)=>{
        if(err){
            console.error("Database Error:", err);
            return res.status(500).json({message:"database failed"});
        }
           if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

        return res.status(200).json({
            message: "Employee updated successfully",
            employeeId: result.insertId
        });
    })
    
}
