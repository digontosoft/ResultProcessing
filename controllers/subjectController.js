const asyncHandler = require("express-async-handler");
const Subject = require("../models/subjecModel");
const Class = require("../models/classModel");

const createSubject = asyncHandler(async (req, res) => {
  try {
    const { name, subjectCode, marks, group, class: id } = req.body;

    const existingSub = await Subject.findOne({ name, subjectCode });
    if (existingSub) {
      return res.status(400).json({
        message: "Subject with the same name and code already exists",
      });
    }

    const data = await Class.findOne({ $or: [{ value: id }, { name: id }] });


    const SubData = await Subject.create({
      name,
      subjectCode,
      group,
      marks,
      class: data._id,
    });
    res.status(201).json({ message: "Subject created successfully", SubData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllSub = asyncHandler(async (req, res) => {
  try {
    const subjects = await Subject.find().populate("class");
    return res
      .status(200)
      .json({ message: "Subjects fetched successfully", subjects });
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