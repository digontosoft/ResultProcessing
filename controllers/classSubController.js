const asyncHandler = require("express-async-handler");
const ClassSub = require("../models/classWithSubject");
const Class = require("../models/classModel");

const createClassSub = asyncHandler(async (req, res) => {
  const { class: name, subjects } = req.body;

  try {
    const data = await Class.findOne({ value: name });
    if (!data) {
      return res.json(404).json({ error: "Class Not found" });
    }
    const classId = data._id;
   // console.log(data);
    
    if (!classId || !subjects || !Array.isArray(subjects)) {
      return res
        .status(400)
        .json({ error: "Class and subjects are required." });
    }

    const existing = await ClassSub.findOne({ class: classId });

    if (existing) {
      const existingSub = existing.subjects.map((s) => s.subjectCode);
      const duplicateSubjects = subjects.filter((s) =>
        existingSub.includes(s.subjectCode)
      );
      if (duplicateSubjects.length > 0) {
        return res.status(400).json({
          error: "Duplicate subjects found for this class.",
          duplicates: duplicateSubjects,
        });
      }
      existing.subjects.push(...subjects);
      await existing.save();
      return res
        .status(200)
        .json({ message: "Subjects added successfully.", data: existing });
    }
    // Create a new document if no existing record for the class
    const newClassWithSubjects = new ClassSub({
      class: classId,
      subjects,
    });
    await newClassWithSubjects.save();

    res.status(201).json({
      message: "Class with subjects created successfully.",
      data: newClassWithSubjects,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

const getAllClassesWithSub = asyncHandler(async (req, res) => {
  try {
    const classes = await ClassSub.find().populate("class");
    if (!classes.length) {
      return res.status(404).json({ message: "No classes found." });
    }
    res.status(200).json({
      message: "Classes fetched successfully.",
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});
const getClassWithSubject = asyncHandler(async (req, res) => {
  try {
    const { class: classId } = req.params;

    const data = await ClassSub.find({ class: classId }).populate("class");

    if (data.length === 0) {
      return res.status(404).json({ message: "No records found." });
    }
    res.status(200).json({ message: "Data fetched successfully.", data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

const updateClassWithSubjects = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { class: classId, subjects } = req.body;
    if (!classId && (!subjects || !Array.isArray(subjects))) {
      return res.status(400).json({
        error: "Please provide a valid class or subjects to update.",
      });
    }

    const classWithSub = await ClassSub.findById(id);
    if (!classWithSub) {
      return res.status(404).json({ error: "ClassWithSub not found." });
    }

    if (classId) {
      classWithSub.class = classId;
    }

    if (subjects && Array.isArray(subjects)) {
      const existingSubject = classWithSub.subjects.map((s) => s.subject);
      const newSubject = subjects.filter(
        (s) => !existingSubject.includes(s.subject)
      );
      classWithSub.subjects.push(...newSubject);
    }
    const updatedClassWithSub = await classWithSub.save();

    res.status(200).json({
      message: "Class and/or subjects updated successfully.",
      data: updatedClassWithSub,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

const deleteClassWithSubjects = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await ClassSub.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ error: "ClassWithSub not found." });
    }

    res.status(200).json({
      message: "ClassWithSub deleted successfully.",
      data: deletedClass,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteSubjectsFromClass = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { subjects } = req.body;

    if (!subjects || !Array.isArray(subjects)) {
      return res
        .status(400)
        .json({ error: "Subjects must be a non-empty array." });
    }
    const classWithSub = await ClassSub.findById(id);
    if (!classWithSub) {
      return res.status(404).json({ error: "ClassWithSub not found." });
    }

    classWithSub.subjects = classWithSub.subjects.filter(
      (s) => !subjects.includes(s.subjectCode)
    );

    const updatedClassWithSub = await classWithSub.save();

    res.status(200).json({
      message: "Subjects deleted successfully.",
      data: updatedClassWithSub,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  createClassSub,
  getAllClassesWithSub,
  getClassWithSubject,
  updateClassWithSubjects,
  deleteClassWithSubjects,
  deleteSubjectsFromClass,
};
