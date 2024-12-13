const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createTeacherVsSubject, getAllTeacherVsSubject, getTeacherVsSubjectByTeacherId, deleteTeacherVsSubject } = require("../controllers/teacherVsSubjectController");

router.post("/teacher-subjects", protect, createTeacherVsSubject);
router.get("/teacher-subjects", protect, getAllTeacherVsSubject);
router.get("/teacher-subjects/:teacher_id", protect, getTeacherVsSubjectByTeacherId);
router.delete("/teacher-subjects/:teacher_id", protect, deleteTeacherVsSubject);

module.exports = router;