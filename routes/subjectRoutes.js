const express = require("express");
const {
  createSubject,
  getAllSub,
  getSubjectById,
  deleteSubject,
  updateSubject,
} = require("../controllers/subjectController");
const { protect, IsSupperadminOrClassadmin } = require("../middleware/auth");

const router = express.Router();

router
  .route("/create-subject")
  .post(protect, IsSupperadminOrClassadmin, createSubject);
router.route("/subjects").get(getAllSub);
router
  .route("/subject/:id")
  .get(getSubjectById)
  .delete(protect, IsSupperadminOrClassadmin, deleteSubject)
  .put(protect, IsSupperadminOrClassadmin, updateSubject);

module.exports = router;
