const express = require("express");
const router = express.Router();
const { protect, IsSupperadminOrClassadmin } = require("../middleware/auth");
const { getAllStudent, getStudentById, updateStudent, deleteStudent, addStudentData } = require("../controllers/studentController");

router.route("/addStudentData").post(protect, IsSupperadminOrClassadmin, addStudentData);
router.route("/getAllStudent").get(protect,getAllStudent);
router
  .route("/student/:id")
  .get(protect, getStudentById)
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);
module.exports = router;
