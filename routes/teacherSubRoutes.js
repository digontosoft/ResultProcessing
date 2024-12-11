const express = require("express");
const {
  createTeacherSub,
  getAllTeacherSubjects,
  getTeacherSubjects,
  updateTeacherSubject,
  deleteTeacherOrSubject,
} = require("../controllers/teacherSubController");

const router = express.Router();

router.route("/teacher-sub").post(createTeacherSub);
router.route("/teachers-sub").get(getAllTeacherSubjects);
router.route("/teacher-subs/:id").get(getTeacherSubjects);
router
  .route("/teacher-sub/:id")
  .put(updateTeacherSubject)
  .delete(deleteTeacherOrSubject);

  module.exports = router