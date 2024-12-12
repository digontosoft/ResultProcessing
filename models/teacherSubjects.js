const mongoose = require("mongoose");

const teacherSubjectsSchema = new mongoose.Schema({
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subject',
        unique:true
    },
    
},{timestamps:true})

const TeacherSub = mongoose.model('TeacherSubject',teacherSubjectsSchema)

module.exports = TeacherSub

