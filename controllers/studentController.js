const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');


// add student data
const addStudentData = asyncHandler(async (req, res) => {
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
const updateStudent = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		user.email = req.body.email || user.email;
		user.firstName = req.body.firstName || user.firstName;
		user.lastName = req.body.lastName || user.lastName;
		user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
		user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
		user.address = req.body.address || user.address;
		user.nid = req.body.nid || user.nid;
		user.userRole = req.body.userRole || user.userRole;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();
		res.json({
			message: 'User updated successfully',
			data: updatedUser,
		});
	} else {
		res.status(404).json({ message: 'User not found' });
	}
});

// Delete single user
const deleteStudent = asyncHandler(async (req, res) => {
	const user = await Student.findById(req.params.id);
	if (user) {
		await user.deleteOne();
		res.json({ message: 'User deleted successfully' });
	} else {
		res.status(404).json({ message: 'User not found' });
	}
});

module.exports = {
	addStudentData,
    getAllStudent,
    getStudentById,
    updateStudent,
    deleteStudent
};
