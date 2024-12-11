const mongoose = require("mongoose");

const teacherSubjectsSchema = new mongoose.Schema({
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    subjects:[
        {
            subject:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Subject",
                required:true
            },
            section:{
                type:String,
                enum:['A','B'],
                default:"A",
                //required:true
            },
            shift:{
                type:String,
                enum:['morning','day'],
                default:"morning",
                //required:true 
            }
        }
    ]
},{timestamps:true})

const TeacherSub = mongoose.model('TeacherSubject',teacherSubjectsSchema)

module.exports = TeacherSub