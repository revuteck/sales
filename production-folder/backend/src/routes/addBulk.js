const express = require("express");
const router = express.Router();
const {bulkCandidates} = require("../controllers/bulkCandidates")

router.post('/bulk-insert', bulkCandidates)

module.exports = router;