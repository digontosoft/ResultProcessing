const express = require("express");
const {
  createTeacherSub,
  getAllTeacherSubjects,
  getTeacherSubjectById,
  deleteTeacherSubject,
  updateTeacherSubject,
} = require("../controllers/teacherSubController");
const { protect, IsSupperadminOrClassadmin } = require('./../middleware/auth')
const router = express.Router();

router.route("/teacher-sub").post(protect,IsSupperadminOrClassadmin,createTeacherSub);
router.route("/teacher-subs").get(getAllTeacherSubjects);
router
  .route("/teacher-sub/:id")
  .get(getTeacherSubjectById)
  .delete(protect,IsSupperadminOrClassadmin,deleteTeacherSubject)
  .put(protect,IsSupperadminOrClassadmin,updateTeacherSubject);

module.exports = router;
