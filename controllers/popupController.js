const Popup = require('../models/Popup');
const path = require('path');
const fs = require('fs');

// ---------------- Create Popup (Admin) ----------------
exports.createPopup = async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileName = req.file.originalname;

    // Optional: deactivate previous popups if you want only one active at a time
    await Popup.updateMany({}, { isActive: false });

    const popup = await Popup.create({
      title,
      subtitle,
      description,
      fileUrl,
      fileName,
      isActive: true,
    });

    res.status(201).json(popup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- Get Latest Active Popup ----------------
exports.getPopup = async (req, res) => {
  try {
    const popup = await Popup.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!popup) return res.status(404).json({ message: 'No active popup found' });

    res.json(popup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- Download Popup File ----------------
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const popup = await Popup.findById(id);
    if (!popup) return res.status(404).json({ message: 'Popup not found' });

    const filePath = path.resolve(__dirname, '..', 'uploads', path.basename(popup.fileUrl));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, popup.fileName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- Delete Popup (Admin) ----------------
exports.deletePopup = async (req, res) => {
  try {
    const { id } = req.params;
    const popup = await Popup.findById(id);
    if (!popup) return res.status(404).json({ message: 'Popup not found' });

    // Delete file from server
    const filePath = path.resolve(__dirname, '..', 'uploads', path.basename(popup.fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Popup.findByIdAndDelete(id);

    res.json({ message: 'Popup deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
