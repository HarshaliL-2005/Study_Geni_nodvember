import File from "../models/file.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// 🧩 Upload a new file
export const uploadFile = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // supports pdf, docx, images, etc.
    });

    // Save file info in MongoDB
    const newFile = await File.create({
      title,
      description,
      fileUrl: result.secure_url,
      uploadedBy: req.user ? req.user._id : "6728f31f9c1f2a001f4590ab", // fallback valid user
      fileType: req.file.mimetype,
    });

    // Remove file from local uploads folder
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (err) {
    console.error("❌ Upload File Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🧩 Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find()
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (err) {
    console.error("❌ Get All Files Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🧩 Get single file details by ID
export const getFileById = async (req, res) => {
  try {
    // 🛡️ Remove any accidental leading colon (:) in URL param
    const fileId = req.params.fileId.replace(/^:/, "").trim();

    const file = await File.findById(fileId).populate(
      "uploadedBy",
      "name email role"
    );

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({
      success: true,
      file,
    });
  } catch (err) {
    console.error("❌ Get File By ID Error:", err);
    res.status(500).json({ message: err.message });
  }
};
