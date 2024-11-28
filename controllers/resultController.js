const Result = require("../models/resultModel");
const asyncHandler = require("express-async-handler");

const createResult = asyncHandler(async (req, res) => {
    const { studentId, session, term, subject, totalMarks, grade, remarks } = req.body;
    try {
        const result = await Result.create({ studentId, session, term, subject, totalMarks, grade, remarks });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = { createResult };
