const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  slug: { type: String, },
  key: { type: String, },
  value: { type: String, },
}, {
  timestamps: true
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;
