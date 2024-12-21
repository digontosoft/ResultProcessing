const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    shift: {
      type: String,
      required: true,
      enum: ["Morning", "Day", "Evening"],
      trim: true,
    },
    group: {
      type: String,
      required: true,
      enum: ["Science", "Commerce", "Arts","General"],
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    roll: {
      type: Number,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
        trim: true,
      },
    religion: {
        type: String,
        trim: true,
      },
    mobile: {
      type: String,
      trim: true,
    },
    class: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    fourthSubjectCode:{
      type: String,
      trim: true,
    }

  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
