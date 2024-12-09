const users = require("./userRoutes");
const configs = require("./configRoutes");
const resultRoutes = require("./result.Routes");
const students = require("./studentRoutes")

module.exports = [users, configs, resultRoutes,students ];