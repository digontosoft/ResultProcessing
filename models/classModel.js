const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, },
  value: { type: String, },
}, {
  timestamps: true
});


const Class = mongoose.model("Class", classSchema);

module.exports = Class;
