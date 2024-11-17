const express = require("express");
const router = express.Router();
const {
  getAllConfigs,
  createConfig,
  updateConfig,
  deleteConfig,
  getConfigbySlug,
} = require("../controllers/configController");
const { protect, IsSupperadminOrClassadmin } = require("../middleware/auth");

router.route("/configs").get(protect, IsSupperadminOrClassadmin, getAllConfigs);
router.route("/config").post(protect, IsSupperadminOrClassadmin, createConfig);
router.route("/configs/:id").put(protect, IsSupperadminOrClassadmin, updateConfig);
router.route("/configs/:id").delete(protect, IsSupperadminOrClassadmin, deleteConfig);
router.route("/configs/slug/:slug").get(protect, IsSupperadminOrClassadmin, getConfigbySlug);
module.exports = router;
