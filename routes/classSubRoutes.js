const express = require("express");
const { classAllSubject } = require("../controllers/classSubController");
const router = express.Router();

// Define routes
router.route("/class-subjects").get(classAllSubject)

module.exports = router;
