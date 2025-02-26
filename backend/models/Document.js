const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: Number, required: true },
  courseCode: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  originalName: { type: String, required: true },
  reviews: [
    {
      text: { type: String, required: true },  // Review text
      createdAt: { type: Date, default: Date.now },  // Timestamp
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Document", DocumentSchema);
