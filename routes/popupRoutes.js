const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const popupController = require('../controllers/popupController');

// ---------------- Multer Storage Setup ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (only allow images and PDFs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

// ---------------- Routes ----------------

// Admin upload popup
// Make sure frontend uses the same endpoint: POST /api/popup/admin
router.post('/admin', upload.single('file'), popupController.createPopup);

// Get latest active popup
router.get('/', popupController.getPopup);

// Download popup file by ID
router.get('/download/:id', popupController.downloadFile);

// Admin delete popup
router.delete('/admin/:id', popupController.deletePopup);

module.exports = router;
