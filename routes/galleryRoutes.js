const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

// Only allow image/video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error('Only images and videos are allowed'));
};

const upload = multer({ storage, fileFilter });

// CRUD routes
router.get('/', galleryController.getAllGallery);
router.post('/', upload.single('image'), galleryController.createGallery);
router.put('/:id', upload.single('image'), galleryController.updateGallery);
router.delete('/:id', galleryController.deleteGallery);

module.exports = router;
