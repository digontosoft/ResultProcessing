const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");
const Result = require("../models/resultModel");

// add student data
const addStudentData = asyncHandler(async (req, res) => {
  const {
    studentId,
    roll,
    class: name,
    shift,
    group,
    section,
    studentName,
    fatherName,
    motherName,
    gender,
    religion,
    mobile,
    year,
    fourthSubjectCode,
  } = req.body;

  try {
    const student = await Student.findOne({
      studentId,
    });
    if (student) {
      return res.status(202).send(new Error("StudentId already exist"));
    }
    const studentData = await Student.create({
      studentId,
      roll,
      class: name,
      shift,
      group,
      section,
      studentName,
      fatherName,
      motherName,
      gender,
      religion,
      mobile,
      year,
      fourthSubjectCode,
    });
    res.json({
      message: "Student data added successfully",
      data: studentData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding student data" });
  }
});

const getAllStudent = asyncHandler(async (req, res) => {
  try {
    const allUsers = await Student.find();
    res.json({
      message: "successfully get all student",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
  }
});

// Get single user by ID
const getStudentById = asyncHandler(async (req, res) => {
  const user = await Student.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update single user
const updateStudent = asyncHandler(async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    //console.log(student);

    res.json({ message: "Class updated successfully", student });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: error.message });
  }
});

// Delete single user
const deleteStudent = asyncHandler(async (req, res) => {
  const user = await Student.findByIdAndDelete(req.params.id);
  if (user) {
    // await Student.deleteOne();
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

//bulk student upload
const bulkUploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const XLSX = require("xlsx");
    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const students = [];
    for (const row of data) {
      const student = await Student.create({
        studentId: row.studentId,
        class: row.class,
        studentName: row.studentName,
        fatherName: row.fatherName,
        motherName: row.motherName,
        gender: row.gender,
        religion: row.religion,
        roll: row.roll,
        section: row.section,
        shift: row.shift,
        group: row.group,
        fourthSubjectCode: row.fourthSubjectCode,
        year: row.year,
        mobile: row.mobile,
      });
      students.push(student);
    }

    // Optional: Remove the temporary file
    const fs = require("fs");
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Student uploaded successfully",
      count: students.length,
      students,
    });
  } catch (error) {
    // If file exists, remove it in case of error
    if (req.file) {
      const fs = require("fs");
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};
//get student based on roll number range
const getStudentByRollRange = asyncHandler(async (req, res) => {
  const {
    startRoll,
    endRoll,
    class: name,
    section,
    shift,
    subject,
    session,
    term,
  } = req.body;
  let religion = null;
  if (subject === "Islam and Moral Education") {
    religion = "Islam";
  } else if (subject === "Hindu and Moral Education") {
    religion = "Hindu";
  } else if (subject === "Christian and Moral Education") {
    religion = "Christian";
  } else if (subject === "Buddhist and Moral Education") {
    religion = "Buddhist";
  }
  try {
    const query = {
      roll: { $gte: startRoll, $lte: endRoll },
      class: name,
      shift,
      section,
      year: session,
    };
    // console.log(religion);

    if (religion) {
      query.religion = religion;
    }
    // console.log(query);

    const students = await Student.find(query).sort({ roll: 1 });
    // console.log("students", students);
    // now get result for this subject,class,shift,section,session,term
    // console.log("subject",name)
    const results = await Result.find({
      subjectName: subject,
      className: name,
      shift,
      section,
      session,
      term,
    });


    //i will only return those students who are not in results
    const studentsNotInResults = students.filter(
      (student) =>
        !results.some((result) => result.studentId === student.studentId)
    );
    res.json({
      message: "Students fetched successfully",
      data: studentsNotInResults,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//student promotion from one class to another class multiple student
const studentPromotion = asyncHandler(async (req, res) => {
  try {
    const { promotedStudent } = req.body;
    if (!promotedStudent || !Array.isArray(promotedStudent)) {
      return res.status(400).json({ message: "Invalid input format" });
    }

    const updatePromises = promotedStudent.map(async (student) => {
      const { id, class: className, section, shift, roll } = student;
      return Student.findByIdAndUpdate(
        id,
        {
          class: className,
          section,
          shift, 
          roll
        },
        { new: true }
      );
    });

    const updatedStudents = await Promise.all(updatePromises);

    res.json({
      message: "Students promoted successfully",
      data: updatedStudents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  addStudentData,
  getAllStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  bulkUploadStudents,
  getStudentByRollRange,
  studentPromotion
};
