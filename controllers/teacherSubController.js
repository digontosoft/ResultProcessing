const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const TeacherSub = require("../models/teacherSubjects");

const createTeacherSub = asyncHandler(async (req, res) => {
  const { teacher, subjects } = req.body;
  const data = await User.findOne({
    $or: [
      { firstName: teacher },
      { lastName: teacher },
      {
        email: teacher,
      },
    ],
  });

  try {
    console.log(data);

    if (!data || !subjects || !Array.isArray(subjects)) {
      return res
        .status(400)
        .json({ error: "Teacher and subject are required" });
    }
    const existing = await TeacherSub.findOne({ id: data._id });
    if (existing) {
      const existingSubject = existing.subjects.map((s) =>
        s.subject.toString()
      );
      const duplicateSubjects = subjects.filter((s) =>
        existingSubject.includes(s.subject)
      );

      if (duplicateSubjects.length > 0) {
        return res.status(400).json({
          error: "Duplicate subjects found for this teacher.",
          duplicates: duplicateSubjects,
        });
      }
      existing.subjects.push(...subjects);
      await existing.save();
      return res
        .status(200)
        .json({ message: "Subjects added successfully.", data: existing });
    }
    const newTeacherSubject = new TeacherSub({ teacher, subjects });
    await newTeacherSubject.save();

    res.status(201).json({
      message: "Teacher with subjects created successfully.",
      data: newTeacherSubject,
    });
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ error: "Internal Server Error." });
  }
});

const getAllTeacherSubjects = asyncHandler(async (req, res) => {
  try {
    const data = await TeacherSub.find().populate("teacher subjects.subject");
    res.status(200).json({ message: "Data fetched successfully.", data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

const getTeacherSubjects = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  try {
    const data = await TeacherSub.findOne({ teacher: teacherId }).populate(
      "teacher subjects.subject"
    );

    if (!data) {
      return res.status(404).json({ message: "No records found." });
    }

    res.status(200).json({ message: "Data fetched successfully.", data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

const updateTeacherSubject = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  const { subjects } = req.body;

  try {
    const teacherSubject = await TeacherSub.findOne({ teacher: teacherId });

    if (!teacherSubject) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    teacherSubject.subjects = subjects; // Replace with new subjects
    await teacherSubject.save();

    res.status(200).json({
      message: "Teacher subjects updated successfully.",
      data: teacherSubject,
    });
  } catch (error) {
    console.error("Error updating TeacherSubjects:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Delete Teacher or Subject
const deleteTeacherOrSubject = asyncHandler(async (req, res) => {
  const { teacherId, subjectId } = req.params;

  try {
    if (subjectId) {
      // Delete a specific subject for a teacher
      const teacherSubject = await TeacherSub.findOne({ teacher: teacherId });

      if (!teacherSubject) {
        return res.status(404).json({ message: "Teacher not found." });
      }

      teacherSubject.subjects = teacherSubject.subjects.filter(
        (s) => s.subject.toString() !== subjectId
      );

      await teacherSubject.save();
      return res
        .status(200)
        .json({
          message: "Subject deleted successfully.",
          data: teacherSubject,
        });
    }

    // Delete the entire teacher record
    await TeacherSub.deleteOne({ teacher: teacherId });
    res.status(200).json({ message: "Teacher deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

module.exports = {
  deleteTeacherOrSubject,
  updateTeacherSubject,
  createTeacherSub,
  getAllTeacherSubjects,
  getTeacherSubjects,
};
