const db = require('../config/db');

 exports.getEmployee = (req, res) =>{
    const sql = "SELECT * FROM emp";

    db.query(sql, (err, results)=>{
        if(err){
            console.log("Error fetching data..!")
            return res.status(500).json({message:"Database server"})
        }
        res.status(200).json(results)
    })
}
// module.exports = { getEmployees };