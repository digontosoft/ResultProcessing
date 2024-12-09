//write a crud api for class model
const Class = require("../models/classModel");
const asyncHandler = require("express-async-handler");

const createClass = asyncHandler(async (req, res) => {
    try {
        const { name, value } = req.body;
        // Check for duplicate slug and key
        const existingClass = await Class.findOne({ name, value });
        if (existingClass) {
          return res.status(400).json({ message: "Class with the same name and value already exists" });
        }
    
        // Create new config
        const config = await Config.create({ key, value, slug });
        res.status(201).json({ message: "Class created successfully", config });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
const getAllClasses = asyncHandler(async (req, res) => {
    try {
        const classes = await Class.find();
        return res.status(200).json({message: "Classes fetched successfully", classes} );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const getClassById = asyncHandler(async (req, res) => {
    try {
        const className = await Class.findById(req.params.id);
        return res.status(200).json({message: "Class fetched successfully", className} );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const deleteClass = asyncHandler(async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "Class deleted successfully"} );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const updateClass = asyncHandler(async (req, res) => {
    try {
        const className = await Class.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json({ message: "Class updated successfully", className });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = { createClass, getAllClasses, getClassById, deleteClass, updateClass };