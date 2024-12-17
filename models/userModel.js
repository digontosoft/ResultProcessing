const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      // unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
      required: true,
      enum: ["superadmin", "classadmin", "student","teacher","operator"],
      default: "student",
    },
    userStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Active", "Deactivated"],
      default: "Active",
    },
    class: {
      type: String,
    },
    class_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Class"
    },
    section: {
      type: String,
    },
    shift: {
      type: String,
    },
    group: {
      type: String,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    religion: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    position: {
      type: String,
    },
    designation: {
      type: String,
    },
    subject: {
      type: String,
    },
    username:{
      type: String,
    }
   
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
