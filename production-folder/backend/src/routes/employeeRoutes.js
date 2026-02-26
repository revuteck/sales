const express = require("express");
const router = express.Router();

const { addEmployee } = require("../controllers/employeeController");
const { getEmployee } = require("../controllers/dataEmployeeController");
const { deleteEmp } = require("../controllers/deleteEmp");
const { updateEmp } = require("../controllers/updateEmp")

// ➕ Add employee
router.post("/add", addEmployee);

// 📄 Get employees
router.get("/data", getEmployee);

// ❌ Delete employee
router.delete("/delete/:id", deleteEmp);
//emp update
router.put("/update/:id", updateEmp);

module.exports = router;
