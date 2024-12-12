const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const Subject = require("../models/subjecModel");
const TeacherSub = require("../models/teacherSubjects");



const createTeacherSub = asyncHandler(async (req, res) => {
  try {
    const { subjectCode, email } = req.body;
    const subject = await Subject.findOne({ subjectCode });
    const userData = await User.findOne({ email });
    const teacher = await TeacherSub.create({
      teacher: userData._id,
      subject: subject._id,
    });
    res.status(201).json({ message: "Teacher created successfully", teacher });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getAllTeacherSubjects = asyncHandler(async (req, res) => {
  try {
    const teachers = await TeacherSub.find()
      .populate({
        path: "teacher",
        select: "-password", // Exclude the password field
      })
      .populate({
        path: "subject",
        populate: {
          path: "class",
          select:'name value '
        },
      });
    return res
      .status(200)
      .json({ message: "Teacher fetched successfully", teachers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getTeacherSubjectById = asyncHandler(async (req, res) => {
  try {
    const teacher = await TeacherSub.findById(req.params.id).populate({
      path: "teacher",
      select: "-password", // Exclude the password field
    })
    .populate({
      path: "subject",
      populate: {
        path: "class",
        select:'name value '
      },
    });
    res
    .status(200)
    .json({ message: "Teacher fetched successfully", teacher });
  } catch (error) {
    
    return res.status(500).json({ message: error.message });
  }
});

const updateTeacherSubject = asyncHandler(async (req, res) => {
  try {
    const {subjectCode,email} = req.body
    const data = await TeacherSub.findOne(req.params.id)
    if(!data) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const subject = await Subject.findOne({ subjectCode });
    const userData = await User.findOne({ email });

    data.teacher = userData._id || data.teacher
    data.subject = subject._id ||data.subject
    await data.save()
    res.json({ message: "Data updated successfully", data });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


const deleteTeacherSubject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await TeacherSub.findByIdAndDelete(id);

    if (!teacher) {
      return res.status(404).json({ message: "TeacherSubject not found." });
    }

    return res.status(200).json({
      message: "Subject deleted successfully.",
      teacher,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});




module.exports = {
  updateTeacherSubject,
  createTeacherSub,
  getAllTeacherSubjects,
  deleteTeacherSubject,
  getTeacherSubjectById,
};
