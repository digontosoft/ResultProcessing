const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const generateResetToken = require("../utils/generateResetToken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sentEmail");

//Login for Users
const Login = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  const user = await User.findOne({phoneNumber});
  console.log(user);
  
  if (user && (await user.matchPassword(password))) {
    res.json({
      message: "login success",
      _id: user._id,
      userType: user.userType,
      name: `${user?.firstName}`,
      token: generateToken(user._id),
      phoneNumber:user.phoneNumber
    });
  } else {
    res.status(202).send(new Error("invalid user name or password"));
  }
});

//Registration  for Users
const Registration = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(202).send(new Error("user already exist"));
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password ? req.body.password : "123456",
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  //console.log(user);
  

  try {
    const createUser = await user.save();
    res.json({
      message: "successfully registration",
      data: createUser,
    });
  } catch (error) {
    console.log(error);
  }
});

//teacher Register

const teacherReg = asyncHandler(async (req, res) => {
  const { phoneNumber,password,firstName,class_id,shift,section,group,userType } = req.body;
  const userExists = await User.findOne({ phoneNumber });

  if (userExists) {
    res.status(202).send(new Error("user already exist"));
    return;
  }
 
  try {
    const user = await User.create({phoneNumber,userType,group,section,password,firstName,class_id,shift})
    
    res.json({
      message: "successfully registration",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ message: error.message });
  }
});



const updateTeacher = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      
    });
    //console.log(user);

    
    user.firstName = req.body.firstName || user.firstName;
    user.username = req.body.username || user.username;
    user.group = req.body.group || user.group;
    user.section = req.body.section || user.section;
    user.shift = req.body.shift || user.shift;
    user.class_id = req.body.class_id || user.class_id;

    const updateData = await user.save();
    res
      .status(200)
      .json({ message: "Teacher updated successfully", updateData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).send(new Error("User not found"));
    return;
  }

  const { resetToken, resetTokenHash } = generateResetToken();

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword?token=${resetToken}`;
  console.log("reset url ", resetUrl);

  const message = `
    <html>
    <body>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href='${resetUrl}'>${resetUrl}</a></p>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).send(new Error("Email could not be sent"));
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).send(new Error("Invalid or expired token"));
    return;
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({ userType: { $ne: "superadmin" } }).populate("class_id");
    res.json({
      message: "successfully registration",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
  }
});

// add student data
const addStudentData = asyncHandler(async (req, res) => {
  try {
    const studentData = await User.create(req.body);
    res.json({
      message: "Student data added successfully",
      data: studentData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding student data" });
  }
});

// Get single user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update single user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.address = req.body.address || user.address;
    user.nid = req.body.nid || user.nid;
    user.userRole = req.body.userRole || user.userRole;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete single user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//get agent type user
module.exports = {
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
  updateTeacher,
  updatePassword,
};
