const Slide = require("../models/Slide")

// ✅ Get all slides
exports.getSlides = async (req, res) => {
  try {
    const slides = await Slide.find().sort({ createdAt: -1 }) // newest first
    res.status(200).json(slides)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch slides", error: err.message })
  }
}

// ✅ Create new slide
exports.createSlide = async (req, res) => {
  try {
    let imageUrl = req.body.image

    // If file uploaded via multer
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    }

    const slide = new Slide({
      tag: req.body.tag,
      titleA: req.body.titleA,
      titleB: req.body.titleB,
      desc: req.body.desc,
      cta: req.body.cta,
      icon: req.body.icon,
      image: imageUrl,
    })

    const savedSlide = await slide.save()
    res.status(201).json(savedSlide)
  } catch (err) {
    res.status(400).json({ message: "Failed to create slide", error: err.message })
  }
}

// ✅ Update slide
exports.updateSlide = async (req, res) => {
  try {
    let updateData = { ...req.body }

    // Handle new image upload
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    }

    const updatedSlide = await Slide.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedSlide) {
      return res.status(404).json({ message: "Slide not found" })
    }

    res.status(200).json(updatedSlide)
  } catch (err) {
    res.status(400).json({ message: "Failed to update slide", error: err.message })
  }
}

// ✅ Delete slide
exports.deleteSlide = async (req, res) => {
  try {
    const deletedSlide = await Slide.findByIdAndDelete(req.params.id)

    if (!deletedSlide) {
      return res.status(404).json({ message: "Slide not found" })
    }

    res.status(200).json({ message: "Slide deleted successfully" })
  } catch (err) {
    res.status(400).json({ message: "Failed to delete slide", error: err.message })
  }
}
