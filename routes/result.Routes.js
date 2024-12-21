const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createResult,
  bulkUploadResults,
  getIndividualResult,
  getAllResultData,
  updateResult,
  deleteResult,
  getTebulationSheet,
} = require("../controllers/resultController");

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

router.post("/result/create", createResult);
router.get("/result/get_all", getAllResultData);
router.put("/result/update/:id", updateResult);
router.delete("/result/delete/:id", deleteResult);
//want to make a route for bulk upload of results
router.post("/result/bulk-upload", upload.single("file"), bulkUploadResults);
router.post("/result/individual", getIndividualResult);
router.post("/result/tebulation-sheet", getTebulationSheet);

module.exports = router;
