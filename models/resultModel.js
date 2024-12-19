const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  session: {
    type: String,
  },
  term: {
    type: String,
  },
  className: {
    type: String,
  },
  section: {
    type: String,
  },
  shift: {
    type: String,
  },
  studentId: {
    type: String,
  },
  rollNo: {
    type: Number,
  },
  subjectName: {
    type: String,
  },
  subjective: {
    type: Number,
  },
  objective: {
    type: Number,
  },
  classAssignment: {
    type: Number,
  },
  practical: {
    type: Number,
  },
  totalMarks: {
    type: Number,
  },
  grade: {
    type: String,
  },
  remarks: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Result", resultSchema);
