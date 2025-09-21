const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { 
    type: String, 
    enum: ['project','facility','event','construction','environment'], 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['image','video'], 
    required: true 
  },
  imageUrl: { type: String, required: true },
  location: { type: String, trim: true },
  date: { type: Date },
  photographer: { type: String, trim: true },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Gallery', gallerySchema);
