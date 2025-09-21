const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    fileUrl: { type: String, required: true }, // frontend needs this to load/download
    fileName: { type: String, required: true }, // original file name
    isActive: { type: Boolean, default: true }, // optional: mark popup as active/inactive
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Popup', popupSchema);
