const express = require("express");
const router = express.Router();
const { protect, IsSupperadminOrClassadmin } = require("../middleware/auth");
const {
  Login,
  Registration,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  addStudentData,
  teacherReg,
} = require("../controllers/userController");

router.route("/register").post(Registration);
router.route('/teacher-reg').post(protect,teacherReg)
router.route("/login").post(Login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/users").get(protect, getAllUsers);
router
  .route("/user/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, deleteUser);
module.exports = router;
