const express = require("express");
const {
  createClassSub,
  getAllClassSub,
  classSubFindById,
  deleteClassSub,
} = require("../controllers/classSubController");
const router = express.Router();

// Define routes
router.post("/class-sub", createClassSub);
router.get("/all-class-sub", getAllClassSub);
router.route("/class-sub/:id").get(classSubFindById).delete(deleteClassSub);

module.exports = router;
