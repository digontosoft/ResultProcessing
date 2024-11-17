const Config = require("../models/configModel");
const asyncHandler = require("express-async-handler");
const getAllConfigs = asyncHandler(async (req, res) => {
  const configs = await Config.find();
  res.json(configs);
});

const createConfig = asyncHandler(async (req, res) => {
    try {
      const { key, value, slug } = req.body;
      // Check for duplicate slug and key
      const existingConfig = await Config.findOne({ slug, key });
      if (existingConfig) {
        return res.status(400).json({ message: "Config with the same slug and key already exists" });
      }
  
      // Create new config
      const config = await Config.create({ key, value, slug });
      res.status(201).json({ message: "Config created successfully", config });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
const updateConfig = asyncHandler(async (req, res) => {
  try {
    const config = await Config.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Config updated successfully", config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getConfigById = asyncHandler(async (req, res) => {
  try {
    const config = await Config.findById(req.params.id);
    res.json({ message: "Config fetched successfully", config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const deleteConfig = asyncHandler(async (req, res) => {
  try {
    await Config.findByIdAndDelete(req.params.id);
    res.json({ message: "Config deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getConfigbySlug = asyncHandler(async (req, res) => {
  console.log(req.params.slug);
  try {
    const config = await Config.find({ slug: req.params.slug });
    console.log(config, "config");
    res.json({ message: "Config fetched successfully", config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getAllConfigs,
  createConfig,
  updateConfig,
  getConfigById,
  deleteConfig,
  getConfigbySlug,
};

