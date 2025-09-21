const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getForms,
  incrementDownload,
  createForm,
  updateForm,
  deleteForm
} = require('../controllers/formController');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});
const upload = multer({ storage });

// Routes
router.get('/', getForms);
router.patch('/:id/download', incrementDownload);
router.post('/', upload.single('file'), createForm);
router.put('/:id', upload.single('file'), updateForm);
router.delete('/:id', deleteForm);

module.exports = router;
