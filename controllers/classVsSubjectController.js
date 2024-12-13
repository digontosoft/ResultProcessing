//write a controller for class vs subject by following other controllers structure

const asyncHandler = require("express-async-handler");
const ClassVsSubject = require("../models/classVsSubjectModel");

const createClassVsSubject = asyncHandler(async (req, res) => {
    const { teacher_id, classVsSubject } = req.body;
   try{
    const InsertClassVsSubject = new ClassVsSubject({ teacher_id, classVsSubject });
    await InsertClassVsSubject.save();
    res.status(201).json({ message: "Class vs subject created successfully", InsertClassVsSubject });
   }catch(error){
    res.status(500).json({ message: "An error occurred.", error });
   }
});
const getAllClassVsSubject = asyncHandler(async (req, res) => {
    try{
        const classVsSubject = await ClassVsSubject.find().populate("teacher_id").populate("classVsSubject.class_id").populate("classVsSubject.subjects");
        res.status(200).json({ message: "Class vs subject fetched successfully", classVsSubject });
    }catch(error){
        res.status(500).json({ message: "An error occurred.", error });
    }
});
const getClassVsSubjectByteacherId = asyncHandler(async (req, res) => {
    try{
        const { teacher_id } = req.params;
        const classVsSubject = await ClassVsSubject.find({ teacher_id }).populate("classVsSubject.class_id").populate("classVsSubject.subjects");
        res.status(200).json({ message: "Class vs subject fetched successfully", classVsSubject });
    }catch(error){
        res.status(500).json({ message: "An error occurred.", error });
    }
});
const deleteClassVsSubject = asyncHandler(async (req, res) => {
    try{
        const { teacher_id } = req.params;
        await ClassVsSubject.findByIdAndDelete(teacher_id);
        res.status(200).json({ message: "Class vs subject deleted successfully" });
    }catch(error){
        res.status(500).json({ message: "An error occurred.", error });
    }
});

module.exports = {
    createClassVsSubject,
    getAllClassVsSubject,
    getClassVsSubjectByteacherId,
    deleteClassVsSubject
}