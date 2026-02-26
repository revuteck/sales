const express = require("express");
const { getCandidates } = require("../controllers/candidateController");
const { addCandidate } = require("../controllers/addCandidate");
const {getEmpCandidates} = require("../controllers/getEmpCandidates")
const {updateStatus} = require("../controllers/updateCandidate")
const { deleteCandidate } = require("../controllers/deleteCandidate")
const {finalStatus} = require("../controllers/finalStatus")
const {getUndoStatus} = require("../controllers/getUndoStatus")
const {getFailed}  = require("../controllers/getFailed")
const editCandidate = require("../controllers/editCandidate");


const router = express.Router();

router.get("/", getCandidates);
router.post("/add", addCandidate);
router.get("/emp", getEmpCandidates)
router.put("/update-status", updateStatus)
router.put("/final-status", finalStatus)
router.put("/undo-status", getUndoStatus)
router.delete("/delete/:id", deleteCandidate)
router.put("/update/:id", editCandidate);
router.post("/add/failed", getFailed);



module.exports = router;
