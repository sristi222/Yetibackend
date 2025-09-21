const mongoose = require('mongoose');

const formSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Form name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Form description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ['HR', 'Finance', 'Operations', 'Procurement', 'Safety'],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String, // e.g., "pdf", "image/png"
      required: true,
    },
    fileSize: {
      type: Number, // store in bytes for easier calculations
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt auto-added
  }
);

// Optional: virtual for file size in KB/MB
formSchema.virtual('fileSizeFormatted').get(function () {
  if (this.fileSize < 1024) return this.fileSize + ' B';
  if (this.fileSize < 1024 * 1024) return (this.fileSize / 1024).toFixed(2) + ' KB';
  return (this.fileSize / (1024 * 1024)).toFixed(2) + ' MB';
});

module.exports = mongoose.model('Form', formSchema);
