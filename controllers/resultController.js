const Result = require("../models/resultModel");
const asyncHandler = require("express-async-handler");

const createResult = asyncHandler(async (req, res) => {
  const { studentId, session, term, className, section, shift, subjectName, subjective, objective } = req.body;
  try {
    const result = await Result.create({ studentId, session, term, className, section, shift, subjectName, subjective, objective });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const bulkUploadResults = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        const XLSX = require('xlsx');
        const workbook = XLSX.readFile(req.file.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const results = [];
        for (const row of data) {
            const result = await Result.create({
                studentId: row.Roll,
                // studentName: row['Student Name'],
                subjective: row.CQ,
                objective: row.MCQ,
                classAssignment: row.CA,
                practical: row.PRAC,
                // Include other required fields from your Result model
                // You might need to add these as default values or from request body
                session: req.body.session,
                term: req.body.term,
                className: req.body.className,
                section: req.body.section,
                shift: req.body.shift,
                subjectName: req.body.subjectName
            });
            results.push(result);
        }

        // Optional: Remove the temporary file
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
        
        res.status(200).json({ 
            message: "Results uploaded successfully", 
            count: results.length,
            results 
        });
    } catch (error) {
        // If file exists, remove it in case of error
        if (req.file) {
            const fs = require('fs');
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createResult, bulkUploadResults };
