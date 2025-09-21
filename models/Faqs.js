const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    q: { type: String, required: true },
    a: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
