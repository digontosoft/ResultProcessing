const express = require("express");
const {
  createTeacherSub,
  getAllTeacherSubjects,
  getTeacherSubjectById,
  deleteTeacherSubject,
  updateTeacherSubject,
} = require("../controllers/teacherSubController");
const router = express.Router();

router.route("/teacher-sub").post(createTeacherSub);
router.route("/teacher-subs").get(getAllTeacherSubjects);
router
  .route("/teacher-sub/:id")
  .get(getTeacherSubjectById)
  .delete(deleteTeacherSubject)
  .put(updateTeacherSubject);

module.exports = router;
