//write a controller for teacher vs subject by following other controllers structure

const asyncHandler = require("express-async-handler");
const TeacherVsSubject = require("../models/teacherVsSubjectModel");

const createTeacherVsSubject = asyncHandler(async (req, res) => {
    const { teacher_id, ClassVsSubject } = req.body;
   try{
    // this teacher has already assigned some subjects to some classes so delete that first
    await TeacherVsSubject.deleteMany({ teacher_id });
    const InsertTeacherVsSubject = new TeacherVsSubject({ teacher_id, ClassVsSubject });
    await InsertTeacherVsSubject.save();
    res.status(201).json({ message: "Teacher vs subject created successfully", InsertTeacherVsSubject });
   }catch(error){
    res.status(500).json({ message: "An error occurred.", error });
   }
});
const getAllTeacherVsSubject = asyncHandler(async (req, res) => {
    try {
        const teacherVsSubject = await TeacherVsSubject.find()
            .populate('teacher_id')
            .populate('ClassVsSubject.class_id', 'name value')
            .populate('ClassVsSubject.subjects', 'name subjectCode');
        res.status(200).json({ message: "Teacher vs subject fetched successfully", teacherVsSubject });
    } catch(error) {
        console.log("error", error);
        res.status(500).json({ message: "An error occurred.", error });
    }
});
const getTeacherVsSubjectByTeacherId = asyncHandler(async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const teacherVsSubject = await TeacherVsSubject.find({ teacher_id })
            .populate('ClassVsSubject.class_id', 'name value')
            .populate('ClassVsSubject.subjects', 'name subjectCode');
        res.status(200).json({ message: "Teacher vs subject fetched successfully", teacherVsSubject });
    } catch(error) {
        res.status(500).json({ message: "An error occurred.", error });
    }
});
const deleteTeacherVsSubject = asyncHandler(async (req, res) => {
    try{
        const { teacher_id } = req.params;
        await TeacherVsSubject.findByIdAndDelete(teacher_id);
        res.status(200).json({ message: "Teacher vs subject deleted successfully" });
    }catch(error){
        res.status(500).json({ message: "An error occurred.", error });
    }
});

module.exports = {
    createTeacherVsSubject,
    getAllTeacherVsSubject,
    getTeacherVsSubjectByTeacherId,
    deleteTeacherVsSubject
}