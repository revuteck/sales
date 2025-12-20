const express = require("express");
const {countryData} = require("../controllers/countryData")
const router = express.Router();

router.get('/data', countryData)
module.exports = router;