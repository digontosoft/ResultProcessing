const mongoose = require("mongoose");

const teacherVsSubjectSchema = new mongoose.Schema({
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ClassVsSubject: [
        {
            class_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class",
                required: true
            },
            shift: {
                type: String,
                required: true
            },
            subjects: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
                required: true
            }]
        }
    ]
})

const TeacherVsSubject = mongoose.model("TeacherVsSubject", teacherVsSubjectSchema);

module.exports = TeacherVsSubject;