const asyncHandler = require("express-async-handler");
const Subject = require("../models/subjecModel");

const classAllSubject = asyncHandler(async(req,res)=>{
  try {
    const {page=1,limit=15,classValue} = req.query
    const filter = {}
    if(classValue) {
      filter['class.value'] = classValue
    }
    const subjects = await Subject.find(filter).skip((page-1)*limit).limit(parseInt(limit))
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects', details: err.message });
  }
})

module.exports = {
  classAllSubject
}