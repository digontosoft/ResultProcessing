const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subjectCode:{
        type:String,
        required:true,
        unique:true
    },
    marks:{
        type: String,
        required:true
      },
      class:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Class"
      },
      group:{
        type:String,
        enum:["general","science","humanities","business"],
        default:'general',
      } 
},{timestamps:true})

const Subject = mongoose.model("Subject",subjectSchema)

module.exports = Subject