import cloudinary from "../config/cloudinary.js";
import Material from "../models/material.models.js";
import multer from "multer";
import fs from "fs";

// 🧠 Multer setup — temporarily saves uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const upload = multer({ storage });

// 🧩 Upload File Controller
export const uploadMaterial = async (req, res) => {
    try {
        const { title, description } = req.body;

        // No file uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto", // handles pdf, images, videos
        });

        // Save file details to MongoDB
        const material = await Material.create({
            title,
            description,
            fileUrl: result.secure_url,
            uploadedBy: req.user.id, // from auth middleware
            fileType: req.file.mimetype,
        });

        // Delete file from local uploads folder
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: "Material uploaded successfully",
            material,
        });
    } catch (err) {
        console.error("❌ Upload Error:", err);
        res.status(500).json({ message: err.message });
    }
};


// 🧩 Get All Uploaded Materials
export const getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find()
            .populate("uploadedBy", "name email role") // show teacher info
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json({
            success: true,
            count: materials.length,
            materials,
        });
    } catch (err) {
        console.error("❌ Fetch Materials Error:", err);
        res.status(500).json({ message: err.message });
    }
};
