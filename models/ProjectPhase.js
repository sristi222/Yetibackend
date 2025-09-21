const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  phase: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  progress: { type: Number, required: true, min: 0, max: 100, default: 0 },
  status: { type: String, required: true, enum: ["Upcoming", "In Progress", "Nearly Complete"] },
  image: { type: String, required: true }, // or false if optional
  milestones: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
