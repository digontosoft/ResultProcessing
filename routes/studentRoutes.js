const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect, IsSupperadminOrClassadmin } = require("../middleware/auth");
const {
  getAllStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  addStudentData,
  bulkUploadStudents,
  getStudentByRollRange,
  studentDeleteMany,
  studentPromotion,
  getStudentList

} = require("../controllers/studentController");
// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to accept only excel files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
router
  .route("/addStudentData")
  .post(protect, IsSupperadminOrClassadmin, addStudentData);
router.route("/student-promotion").post(studentPromotion);
router.route("/get-student-by-roll-range").post(getStudentByRollRange);
router.route("/get-student-list").post(getStudentList);
// router.route("/getAllStudent").get(protect,getAllStudent);
router.route("/getAllStudent").get(getAllStudent);
router
  .route("/student/:id")
  .get(protect, getStudentById)
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);

router.route('/student/many-delete').post(protect,studentDeleteMany)
router.post("/student/bulk-upload", upload.single("file"), bulkUploadStudents);
module.exports = router;
