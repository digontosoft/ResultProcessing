const express = require("express");
const router = express.Router();
const { 
    createClass, 
    getAllClasses, 
    getClassById, 
    updateClass, 
    deleteClass 
} = require("../controllers/classController");

// Define routes
router.post("/class", createClass);
router.get("/class", getAllClasses);
router.get("/class/:id", getClassById);
router.put("/class/:id", updateClass);
router.delete("/class/:id", deleteClass);

module.exports = router;