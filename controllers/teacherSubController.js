const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const TeacherSub = require("../models/teacherSubjects");

const createTeacherSub = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getAllTeacherSubjects = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getTeacherSubjectById = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updateTeacherSubject = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const deleteTeacherSubject = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const deleteTeacherEachSub = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = {
  updateTeacherSubject,
  createTeacherSub,
  getAllTeacherSubjects,
  deleteTeacherEachSub,
  deleteTeacherSubject,
  getTeacherSubjectById,
};
