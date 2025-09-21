const express = require("express");
const router = express.Router();
const {
  getMarquees,
  createMarquee,
  updateMarquee,
  deleteMarquee,
} = require("../controllers/marqueeController");

// GET all
router.get("/", getMarquees);

// POST new
router.post("/", createMarquee);

// PUT update by id
router.put("/:id", updateMarquee);

// DELETE by id
router.delete("/:id", deleteMarquee);

module.exports = router;
