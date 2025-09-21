const Gallery = require('../models/Gallery');

// GET all gallery items
exports.getAllGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching gallery items:", err);
    res.status(500).json({ error: "Failed to fetch gallery items." });
  }
};

// CREATE gallery item
exports.createGallery = async (req, res) => {
  try {
    const {
      title,
      description = "",
      category,
      type,
      location = "",
      date,
      photographer = "",
      tags = "",
      featured = false
    } = req.body;

    if (!title || !category || !type) {
      return res.status(400).json({ error: "Title, category, and type are required." });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    
    const item = new Gallery({
      title,
      description,
      category,
      type,
      imageUrl,
      location,
      date: date ? new Date(date) : undefined,
      photographer,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featured: featured === "true" || featured === true
    });

    await item.save();
    res.status(201).json(item);

  } catch (err) {
    console.error("Error saving gallery item:", err);
    res.status(500).json({ error: "Failed to create gallery item." });
  }
};

// UPDATE gallery item
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;
    if (updateData.tags) updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    if (updateData.featured) updateData.featured = updateData.featured === "true" || updateData.featured === true;
    if (updateData.date) updateData.date = new Date(updateData.date);

    const updated = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: "Gallery item not found." });

    res.json(updated);

  } catch (err) {
    console.error("Error updating gallery item:", err);
    res.status(500).json({ error: "Failed to update gallery item." });
  }
};

// DELETE gallery item
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Gallery.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Gallery item not found." });

    res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    console.error("Error deleting gallery item:", err);
    res.status(500).json({ error: "Failed to delete gallery item." });
  }
};
