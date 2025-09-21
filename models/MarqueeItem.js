const mongoose = require("mongoose");

const marqueeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Marquee", marqueeSchema);
