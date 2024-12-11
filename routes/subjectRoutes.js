const express = require("express");
const {
  createSubject,
  getAllSub,
  getSubjectById,
  deleteSubject,
  updateSubject,
} = require("../controllers/subjectController");

const router = express.Router();

router.route("/create-subject").post(createSubject);
router.route("/subjects").get(getAllSub);
router
  .route("/subject/:id")
  .get(getSubjectById)
  .delete(deleteSubject)
  .put(updateSubject);

  module.exports = router