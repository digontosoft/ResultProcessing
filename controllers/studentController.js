const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');


// add student data
const addStudentData = asyncHandler(async (req, res) => {
    console.log("api called")
	try {
		const studentData = await Student.create(req.body);
		res.json({
			message: 'Student data added successfully',
			data: studentData,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error adding student data' });
	}
});


const getAllStudent = asyncHandler(async (req, res) => {
	try {
		const allUsers = await Student.find();
		res.json({
			message: 'successfully get all student',
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
		res.status(404).json({ message: 'User not found' });
	}
});

// Update single user
const updateStudent = asyncHandler(async (req, res)=>{
	try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json({ message: "Class updated successfully", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete single user
const deleteStudent = asyncHandler(async (req, res) => {
	const user = await Student.findById(req.params.id);
	if (user) {
		await Student.deleteOne();
		res.json({ message: 'User deleted successfully' });
	} else {
		res.status(404).json({ message: 'User not found' });
	}
});

//bulk student upload
const bulkUploadStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        const XLSX = require('xlsx');
        const workbook = XLSX.readFile(req.file.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const students = [];
        for (const row of data) {
            const student = await Student.create({
                studentId: row.studentId,
                studentName: row.studentName,
                fatherName: row.fatherName,
                gender: row.gender,
                religion: row.religion,
                roll: row.roll,
                section: row.section,
                shift: row.shift,
                group: row.group,
                year: row.year,
                mobile: row.mobile,
         
            });
            students.push(student);
        }

        // Optional: Remove the temporary file
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
        
        res.status(200).json({ 
            message: "Student uploaded successfully", 
            count: students.length,
            students 
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

module.exports = {
	addStudentData,
    getAllStudent,
    getStudentById,
    updateStudent,
    deleteStudent,
    bulkUploadStudents
};
