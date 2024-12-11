const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subjectCode:{
        type:String,
        required:true
    },
    marks:{
        type: String,
        required:true
      },
      group:{
        type:String,
        enum:["general","science","humanities","business"],
        default:'general',
      } 
},{timestamps:true})

const Subject = mongoose.model("Subject",subjectSchema)

module.exports = Subject