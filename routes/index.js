const users = require("./userRoutes");
const configs = require("./configRoutes");
const resultRoutes = require("./result.Routes");
const students = require("./studentRoutes");
const classRoutes = require("./classRoutes");
const subject = require("./subjectRoutes");
const classSub = require("./classSubRoutes");
const teacherSub = require("./teacherSubRoutes");
const teacherVsSubjectRoutes = require("./teacherVsSubjectRoutes");

module.exports = [
  users,
  configs,
  resultRoutes,
  students,
  classRoutes,
  subject,
  classSub,
  teacherSub,
  teacherVsSubjectRoutes,
];
