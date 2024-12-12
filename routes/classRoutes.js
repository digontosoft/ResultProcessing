const express = require("express");
const router = express.Router();
const { 
    createClass, 
    getAllClasses, 
    getClassById, 
    updateClass, 
    deleteClass 
} = require("../controllers/classController");
const { protect, IsSupperadminOrClassadmin } = require("../middleware/auth");

// Define routes
router.post("/class",protect,IsSupperadminOrClassadmin, createClass);
router.get("/class", getAllClasses);
router.get("/class/:id", getClassById);
router.put("/class/:id",protect,IsSupperadminOrClassadmin, updateClass);
router.delete("/class/:id",protect,IsSupperadminOrClassadmin, deleteClass);

module.exports = router;