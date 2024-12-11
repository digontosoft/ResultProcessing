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
                ref:"ClassWithSub",
                required:true
            },
            section:{
                type:String,
                enum:['A','B'],
                default:null,
                required:true
            },
            shift:{
                type:String,
                enum:['morning','day'],
                default:null,
                required:true 
            }
        }
    ]
},{timestamps:true})

const TeacherSub = mongoose.model('TeacherSubject',teacherSubjectsSchema)

module.exports = TeacherSub