const asyncHandler = require("express-async-handler");
const ClassSub = require("../models/classWithSubject");
const Subject = require("../models/subjecModel");
const Class = require("../models/classModel");

const createClassSub = asyncHandler(async (req, res) => {
  try {
    const { class: name, subject } = req.body;
    const data1 = await Class.find({ value: name });

    const classData = await ClassSub.find({ class: data1._id });
    const subData = await Subject.find({ subjectCode: subject });

    if (!subData) {
      return res.status(404).json({ message: "Subject not found." });
    }
    //console.log(subData);
    if (classData) {
      //duplicate check
      const isDuplicate = classData[0].subjects.some(
        (s) => s.subject === subData[0]._id
      );

      if (isDuplicate) {
        return res.status(400).json({
          error: "Duplicate subject found for this class.",
          duplicateSubject: subData,
        });
      }
      classData[0].subjects.push({ subject: subData._id });
      console.log(classData[0].subjects);

      await classData[0].save();
      res.status(200).json({
        message: "Subject added successfully to the class.",
      });
    }

    const data = await ClassSub.create({ class: classData._id });

    res.status(200).json({
      message: "Subject added successfully to the class.",
      data,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: "An error occurred.", error });
  }
});

const getAllClassSub = asyncHandler(async (req, res) => {
  try {
    const data = await ClassSub.find().populate("subjects").populate("class");
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error });
  }
});

const classSubFindById = asyncHandler(async (req, res) => {
  try {
    const data = await ClassSub.findById(req.params.id);
    return res
      .status(200)
      .json({ message: "Class Subject fetched successfully", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const deleteClassSub = asyncHandler(async (req, res) => {
  try {
    await ClassSub.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Class sub deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createClassSub,
  getAllClassSub,
  classSubFindById,
  deleteClassSub,
};
