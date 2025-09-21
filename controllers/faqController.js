const FAQ = require("../models/Faqs");

// Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Create FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { q, a } = req.body;
    if (!q || !a) return res.status(400).json({ message: "All fields are required" });

    const faq = new FAQ({ q, a });
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { q, a } = req.body;

    const faq = await FAQ.findByIdAndUpdate(id, { q, a }, { new: true });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    res.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
