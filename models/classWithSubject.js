const { default: mongoose } = require("mongoose");

const classWithSubject = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjects: [
      {
        subject: {
          type: String,
          required:true
        },

        subjectCode: {
          type: String,
          required:true
        },
        marks:{
          type: String,
          required:true
        },
        year:{
          type: String,
          required:true
        },
        group:{
          type:String,
          enum:["general","science","humanities","arts"],
          default:null,
          required:true
        }
      },
    ],
  },
  { timestamps: true }
);

const ClassSub = mongoose.model("ClassWithSub", classWithSubject);

module.exports = ClassSub;
