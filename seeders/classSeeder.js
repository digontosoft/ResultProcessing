const mongoose = require("mongoose");
const Class = require("../models/classModel");
const connectDB = require("../config/db");
const dotenv = require("dotenv");
dotenv.config();
connectDB();

const classes = [
  { name: "I", value: "1" },
  { name: "II", value: "2" },
  { name: "III", value: "3" },
  { name: "IV", value: "4" },
  { name: "V", value: "5" },
  { name: "VI", value: "6" },
  { name: "VII", value: "7" },
  { name: "VIII", value: "8" },
  { name: "IX", value: "9" },
  { name: "X", value: "10" }
];

const seedClasses = async () => {
  try {
    // Connect to MongoDB
    console.log("Connected to MongoDB...");

    // Delete existing classes
    await Class.deleteMany({});
    console.log("Deleted existing classes...");

    // Insert new classes
    await Class.insertMany(classes);
    console.log("Classes seeded successfully!");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB...");

  } catch (error) {
    console.error("Error seeding classes:", error);
    process.exit(1);
  }
};

// Run the seeder
seedClasses(); 