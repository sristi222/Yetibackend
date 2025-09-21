const Marquee = require("../models/MarqueeItem");

exports.getMarquees = async (req, res) => {
  try {
    const items = await Marquee.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMarquee = async (req, res) => {
  try {
    const { title, link } = req.body;
    const newItem = await Marquee.create({ title, link });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMarquee = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Marquee.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMarquee = async (req, res) => {
  try {
    const { id } = req.params;
    await Marquee.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
