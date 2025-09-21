const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");

// CRUD routes
router.get("/", faqController.getFAQs);         // Get all FAQs
router.post("/", faqController.createFAQ);      // Create FAQ
router.put("/:id", faqController.updateFAQ);   // Update FAQ
router.delete("/:id", faqController.deleteFAQ); // Delete FAQ

module.exports = router;
