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
  
  updateTeacher,
  updatePassword,
  teacherReg,
} = require("../controllers/userController");

// router.route("/register").post(Registration);
// router.route('/teacher-reg').post(protect,teacherReg)
// router.route("/login").post(Login);
// router.route("/forgotPassword").post(forgotPassword);
// router.route("/resetPassword").post(resetPassword);
// router.route("/users").get(protect, getAllUsers);
// router
//   .route("/user/:id")
//   .get(protect, getUserById)
//   .put(protect, updateUser)
//   .delete(protect, deleteUser);
// router.route("/teacher/:id").put(updateTeacher)

router.route("/register").post(Registration);
router.route("/teacher-reg").post(teacherReg);
router.route("/login").post(Login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/users").get(getAllUsers);
router.route("/user/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.route("/teacher/:id").put(updateTeacher);
router.route("/change-password/:id").put(updatePassword)

module.exports = router;
