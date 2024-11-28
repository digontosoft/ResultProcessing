const express = require("express");
const router = express.Router();
const { createResult } = require("../controllers/resultController");

router.post("/result/create", createResult);

module.exports = router;
