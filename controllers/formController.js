const Form = require('../models/Forms');
const fs = require('fs');
const path = require('path');

// Get all forms
const getForms = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const forms = await Form.find(query).sort({ lastUpdated: -1 });
    res.json(forms);
  } catch (err) {
    next(err);
  }
};

// Increment download count
const incrementDownload = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    form.downloads += 1;
    await form.save();
    res.json(form);
  } catch (err) {
    next(err);
  }
};

// Create form
const createForm = async (req, res, next) => {
  try {
    const { name, description, category, fileName, fileType, fileSize } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'File is required' });

    const newForm = new Form({
      name,
      description,
      category,
      fileUrl: '/' + file.path.replace(/\\/g, '/'),
      fileName: fileName || file.originalname,
      fileType: fileType || file.mimetype,
      fileSize: fileSize ? Number(fileSize) : file.size,
      lastUpdated: new Date(),
    });

    await newForm.save();
    res.status(201).json(newForm);
  } catch (err) {
    next(err);
  }
};

// Update form
const updateForm = async (req, res, next) => {
  try {
    const { name, description, category, fileName, fileType, fileSize } = req.body;
    const file = req.file;

    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    form.name = name || form.name;
    form.description = description || form.description;
    form.category = category || form.category;
    form.lastUpdated = new Date();

    if (file) {
      // Remove old file
      if (form.fileUrl) {
        const oldPath = path.join(__dirname, '..', form.fileUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      form.fileUrl = '/' + file.path.replace(/\\/g, '/');
      form.fileName = fileName || file.originalname;
      form.fileType = fileType || file.mimetype;
      form.fileSize = fileSize ? Number(fileSize) : file.size;
    }

    await form.save();
    res.json(form);
  } catch (err) {
    next(err);
  }
};

// Delete form
const deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    if (form.fileUrl) {
      const filePath = path.join(__dirname, '..', form.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await form.deleteOne();
    res.json({ message: 'Form deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getForms,
  incrementDownload,
  createForm,
  updateForm,
  deleteForm,
};
