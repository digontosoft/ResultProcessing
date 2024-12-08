const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect, IsSupperadminOrClassadmin } = require("../middleware/auth");
const { getAllStudent, getStudentById, updateStudent, deleteStudent, addStudentData, bulkUploadStudents } = require("../controllers/studentController");
// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// File filter to accept only excel files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.ms-excel' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
    } else {
        cb(new Error('Only Excel files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});
router.route("/addStudentData").post(protect, IsSupperadminOrClassadmin, addStudentData);
router.route("/getAllStudent").get(protect,getAllStudent);
router
  .route("/student/:id")
  .get(protect, getStudentById)
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);
  router.post("/student/bulk-upload", upload.single('file'), bulkUploadStudents);
module.exports = router;
