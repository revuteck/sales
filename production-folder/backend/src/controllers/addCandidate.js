const db = require("../config/db");

exports.addCandidate = (req, res) =>{

    const{domain, name, website, email, phone, empID, empName, countryId} = req.body;
    console.log(domain, name, website, email, phone, empID, empName, countryId);
    if(!domain || !name || !website || !email || !empID || !empName ||!countryId){
        return res.status(400).json({message:"All fields are required"})
    }
    
    db.query(
        "SELECT country_name from countries where country_id=? ",
        [countryId], 
        (err, result)=>{
        if(err){
            console.log("Database error:", err)
            return res.status(500).json({message: "Country name not found with CountryId"})
        }
         if (result.length === 0) {
        return res.status(404).json({ message: "Invalid Country ID" });
      }
        const countryName = result[0].country_name;

    
    const sql = `INSERT INTO candidates(comp_domain, comp_name, website, email, phone, assigned_emp_id, emp_name,country_id, country_name ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    db.query(sql, [domain, name, website, email, phone, empID, empName, countryId, countryName], (err2, result2)=>{
        if (err2) {
            console.error("Database Error:", err2);
            return res.status(500).json({ message: "Database Insert Failed" });
        }

        return res.status(201).json({
            message: "Candidate added successfully",
            candidateId: result2.insertId
        });
    })
    })

}
