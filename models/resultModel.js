const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
   studentId: { 
    type: Number,
   },
   session: {
    type: String,
   },
   term: {
    type: String,
   },
   subject:[
    {
        subjectID: String,
        subjective: Number,
        objective: Number,
        practical: Number,
        totalMarks: Number
    }
   ],
   totalMarks: Number,
   grade: String,
   remarks: String,
   createdAt: {
    type: Date,
    default: Date.now,
   },
});

module.exports = mongoose.model("Result", resultSchema);
