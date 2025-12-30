const express = require("express");
const {countryData} = require("../controllers/countryData")
const {getupdateStatus} = require("../controllers/countryUpdate")
const router = express.Router();

router.get('/data', countryData)
router.put('/update-status', getupdateStatus);
module.exports = router;