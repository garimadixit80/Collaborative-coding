const express = require("express");
const { saveInterview } = require("../controllers/interviewController");
const router = express.Router();

router.post("/save", saveInterview);

module.exports = router;
