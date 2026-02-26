const db = require('../config/db')

const getCandidates = (req, res) =>{
    const sql = "   SELECT * FROM candidates";

    db.query(sql, (err, results)=>{
        if(err){
            console.log("Error fetching data");
            return res.status(500).json({message:"Database server"})
        }
        res.status(200).json(results)
    })
}

module.exports = { getCandidates };