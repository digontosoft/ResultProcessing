const asyncHandler = require("express-async-handler");
const Subject = require("../models/subjecModel");

const createSubject = asyncHandler(async (req, res) => {
  try {
    const { name, subjectCode, marks, group } = req.body;

    const existingSub = await Subject.findOne({ name, subjectCode });
    if (existingSub) {
      return res
        .status(400)
        .json({
          message: "Subject with the same name and code already exists",
        });
    }

    const SubData = await Subject.create({ name, subjectCode, group, marks });
    res
      .status(201)
      .json({ message: "Subject created successfully", SubData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllSub = asyncHandler(async (req, res) => {
  try {
    const subjects = await Subject.find();
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
    const className = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Subject updated successfully", className });
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
