const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash this later
  role: { type: String, default: "admin" }
})

module.exports = mongoose.model("Admin", adminSchema)
