const Result = require("../models/resultModel");
const Student = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createResult = asyncHandler(async (req, res) => {
  const { session, term, className, section, shift, subjectName,results}= req.body;
  const insertablePayload = [];
  for(const result of results){
    const {studentId, subjective, objective, classAssignment,practical} = result;
    const payload = {
      studentId, session, term, className, section, shift, subjectName, subjective, objective, classAssignment,practical
    }
    insertablePayload.push(payload);
  }
  try {
    const result = await Result.create(insertablePayload);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllResultData = asyncHandler(async(req,res)=>{
    try {
        const allResult = await Result.find();
		res.json({
			message: 'successfully get all result',
			data: allResult,
		});
    } catch (error) {
        console.log("error ", error)
        res.status(404).json({ message: 'Result not found' });
    }
})

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

const calculateResultSummary = async (TotalResult, className, section, shift) => {
    // Calculate total marks and obtained marks
    let totalMarks = 0;
    let obtainedMarks = 0;
    
    for (const result of TotalResult) {
        totalMarks += result.fullMarks;
        obtainedMarks += result.totalMarks;
    }

    // Get total students count in the class
    const studentsCount = await Student.countDocuments({
        class: className,
        section: section,
        shift: shift
    });

    // Calculate GPA (assuming 4th subject is Higher Math)
    const mainSubjects = TotalResult.filter(result => result.subject !== 'Highermath');
    
    // Calculate GPA without 4th subject
    const gpaWithout4th = (mainSubjects.reduce((sum, result) => sum + result.GP, 0) / mainSubjects.length).toFixed(2);
    
    // Calculate GPA with 4th subject (if it improves the result)
    const higherMathResult = TotalResult.find(result => result.subject === 'Highermath');
    const gpa = higherMathResult && higherMathResult.GP > gpaWithout4th 
        ? ((mainSubjects.reduce((sum, result) => sum + result.GP, 0) + higherMathResult.GP) / (mainSubjects.length + 1)).toFixed(2)
        : gpaWithout4th;

    return {
        totalMarks,
        obtainedMarks,
        studentsCount,
        gpaWithout4th: parseFloat(gpaWithout4th),
        gpa: parseFloat(gpa),
        remark: getRemark(parseFloat(gpa))
    };
};

const getRemark = (gpa) => {
    if (gpa >= 4.5) return 'Excellent';
    if (gpa >= 4.0) return 'Very Good';
    if (gpa >= 3.5) return 'Good';
    if (gpa >= 3.0) return 'Fair';
    return 'Need Improvement';
};

const getIndividualResult = asyncHandler(async (req, res) => {
    try {
        const { session, term, className, section, shift, studentId } = req.body;
        const results = await Result.find({ session, term, className, section, shift, studentId });
        const studentInfo = await Student.findOne({ studentId, class: className, section, shift });
        //subject vs full marks hash data
        const subjectVsFullMarks = {
            "Bangla1st": 100,
            "Bangla2nd": 100,
            "English1st": 100,
            "English2nd": 100,
            "Math": 100,
            "Islam": 100,
            "BGS": 100,
            "Physics": 100,
            "Chemistry": 100,
            "Highermath": 100,
            "Biology": 100,
            "ICT": 50
        }
        const resultGrading = {
            "A+": 5.00,
            "A": 4.00,
            "A-": 3.50,
            "B": 3.00,
            "C": 2.00,
            "D": 1.00,
            "F": 0.00,
        }
        
        const TotalResult = [];
        for(const result of results){
            const {subjectName, subjective, objective, classAssignment, practical} = result;
            const rawMarks80 = ((subjective ?? 0) + (objective ?? 0) + (practical ?? 0)) * 0.8;
            const totalRawMarks = rawMarks80 + (classAssignment ?? 18);   
            const subjectWiseResult = {
                subject: subjectName,
                fullMarks: subjectVsFullMarks[subjectName],
                subjective: subjective ?? 0,
                objective: objective ?? 0,
                practical: practical ?? 0,
                "80%": Math.abs(rawMarks80 % 1) >= 0.05 ? Math.round(rawMarks80) : Math.floor(rawMarks80),
                "CA(20%)": classAssignment ?? 18,
                totalMarks: Math.abs(totalRawMarks % 1) >= 0.05 ? Math.round(totalRawMarks) : Math.floor(totalRawMarks),
                grade: calculateGrade(Math.abs(totalRawMarks % 1) >= 0.05 ? Math.round(totalRawMarks) : Math.floor(totalRawMarks)),
                GP: resultGrading[calculateGrade(Math.abs(totalRawMarks % 1) >= 0.05 ? Math.round(totalRawMarks) : Math.floor(totalRawMarks))],
                Highest: subjectVsFullMarks[subjectName],
            }
            TotalResult.push(subjectWiseResult);
        }
        // Calculate summary using the new function
        const summary = await calculateResultSummary(TotalResult, className, section, shift);

        res.status(200).json({
            Message: "Result fetched successfully", 
            Data: {
                studentInfo, 
                TotalResult,
                summary
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

function calculateGrade(totalMarks){
    if(totalMarks >= 80) return "A+";
    if(totalMarks >= 70) return "A";
    if(totalMarks >= 60) return "A-";
    if(totalMarks >= 50) return "B";
    if(totalMarks >= 40) return "C";
    if(totalMarks >= 33) return "D";
    return "F";
}

module.exports = { createResult, bulkUploadResults, getIndividualResult,getAllResultData };
