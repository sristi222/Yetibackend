const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true, // full URL or relative path will be stored
    },
    tag: { type: String, trim: true },
    titleA: { type: String, trim: true },
    titleB: { type: String, trim: true },
    desc: { type: String, trim: true },
    cta: {
      label: { type: String, trim: true },
      href: { type: String, trim: true },
    },
    icon: {
      type: String,
      enum: ["Droplet", "Mountain", "Gauge", "BatteryCharging"],
      default: "Droplet",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slide", slideSchema);
