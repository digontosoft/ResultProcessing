const asyncHandler = require("express-async-handler");
const Subject = require("../models/subjecModel");
const Class = require("../models/classModel");

const createSubject = asyncHandler(async (req, res) => {
  try {
    const { name, subjectCode, marks, group, class: id, year } = req.body;

    // const data = await Class.findOne({ $or: [{ value: id }, { name: id }] });
    // const existingSub = await Subject.findOne({ $and: [{ name }, { class: data._id }] });
    // if (existingSub) {
    //   return res.status(400).json({
    //     message: "Subject with the same name already exists",
    //   });
    // }


    const SubData = await Subject.create({
      name,
      subjectCode,
      group,
      marks,
      class: data._id,
      year,
    });
    res.status(201).json({ message: "Subject created successfully", SubData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllSub = asyncHandler(async (req, res) => {
  const { classId, className, classValue,page=1,limit=15 } = req.query;

  const filter = {};
  if (classId) filter['class._id'] = classId;
  if (className) filter['class.name'] = className;
  if (classValue) filter['class.value'] = classValue;

  try {
    

    const subjects = await Subject.find()
      .populate({
        path: 'class',
      })
      // .skip((page - 1) * limit)
      // .limit(parseInt(limit)).exec();
    

    return res.status(200).json({
      message: "Subjects fetched successfully",
      subjects: subjects,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


const getSubjectById = asyncHandler(async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    return res
      .status(200)
      .json({ message: "Subject fetched successfully", subject });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const deleteSubject = asyncHandler(async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updateSubject = asyncHandler(async (req, res) => {
  try {
    const { name, subjectCode, marks, group, class: id } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404).json({ message: "Subject not found" });
      return;
    }
    const data = await Class.findOne({ $or: [{ value: id }, { name: id }] });

    subject.name = name || subject.name;
    subject.subjectCode = subjectCode || subject.subjectCode;
    subject.class = data._id || subject.class;
    subject.marks = marks || subject.marks;
    subject.group = group || subject.group;
    subject.year = year || subject.year;

    await subject.save();

    res.json({ message: "Subject updated successfully", subject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createSubject,
  getAllSub,
  deleteSubject,
  updateSubject,
  getSubjectById,
};
