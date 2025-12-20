const db = require('../config/db')

const countryData = (req, res)=> {
    const sql = 'SELECT * FROM countries';

    db.query(sql, (err, result)=>{
        if(err){
            console.log("Error fetching data");
            return res.status(500).json({message:"Database server"})
        }
        res.status(200).json(result)
    })
}
module.exports = {countryData};

