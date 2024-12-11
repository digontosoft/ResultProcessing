const { createClassSub, getAllClassesWithSub, getClassWithSubject, updateClassWithSubjects, deleteClassWithSubjects, deleteSubjectsFromClass } = require("../controllers/classSubController")

const express = require("express");
const router = express.Router();


router.route("/class-sub").post(createClassSub)
router.route("/class-subjects").get(getAllClassesWithSub)
router.route("/class-sub/:id").get(getClassWithSubject) //?class=id  query use 
router.route("/class-sub/:id").put(updateClassWithSubjects).delete(deleteClassWithSubjects)
router.route("/class-sub/:id/subjects").delete(deleteSubjectsFromClass)

module.exports = router