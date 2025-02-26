// routes/documentRoutes.js - Document Upload & Download
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Document = require("../models/Document");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "documents", // Optional folder name
        access_mode: "public", // Ensure it's public
      },
      (error, uploadResult) => {
        if (error) return reject(error);
        resolve(uploadResult);
      }
    );
    stream.end(fileBuffer);
  });
};

router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { title, description, department, level, courseCode } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadResult = await uploadToCloudinary(file.buffer);
    console.log("Upload result:", uploadResult);


    const newDocument = new Document({
      title,
      description,
      department,
      level,
      courseCode,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,         // Save the public ID
      originalName: file.originalname,           // Optionally save the original filename
      reviews: [],
    });
    await newDocument.save();
    
    
    
    
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a review for a document
router.post("/review/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { review } = req.body;
    
    console.log("Received review request for document ID:", id);
    console.log("Review content:", review);

    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.reviews.push({ text: review }); // Updated for the new schema
    await document.save();

    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error in review submission:", error);  // 🔴 Print error details
    res.status(500).json({ message: "Error submitting review", error: error.message });
  }
});


router.get("/download/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    // Generate a download URL using the publicId if available,
    // or fallback to the fileUrl with the attachment parameter
    const downloadUrl = document.publicId
      ? cloudinary.url(document.publicId, {
          resource_type: "raw",
          attachment: document.originalName || document.title,
          secure: true,
          sign_url: true,
        })
      : (document.fileUrl + "?fl_attachment=true");
    res.redirect(downloadUrl);
  } catch (error) {
    console.error("Error downloading document:", error);
    res.status(500).json({ message: error.message });
  }
});







module.exports = router;