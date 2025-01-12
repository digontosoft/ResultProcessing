const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
     
    },
    marks: {
      type: String,
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    year: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      enum: ["General", "Science", "Humanities", "Business"],
      default: "General",
    },
    isFourthSubject: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
