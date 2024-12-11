const { default: mongoose } = require("mongoose");

const classWithSubject = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required:true
    },
    subjects: [
      {
        subject:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Subject",
          required:true
        }
      }
    ],
  },
  { timestamps: true }
);

const ClassSub = mongoose.model("ClassWithSub", classWithSubject);

module.exports = ClassSub;
