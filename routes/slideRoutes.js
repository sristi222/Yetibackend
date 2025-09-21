const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")

const { getSlides, createSlide, updateSlide, deleteSlide } = require("../controllers/slideController")

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads")) // cross-platform safe
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"))
    }
  },
})

// Routes
router.get("/", getSlides)

router.post("/", (req, res, next) =>
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message })
    next()
  }),
  createSlide
)

router.put("/:id", (req, res, next) =>
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message })
    next()
  }),
  updateSlide
)

router.delete("/:id", deleteSlide)

module.exports = router
