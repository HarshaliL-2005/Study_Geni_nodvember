import express from "express";
import {
    uploadMaterial,
    upload,
    getAllMaterials,
} from "../controllers/material.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // ✅ corrected import

const router = express.Router();

// 🧩 Upload Material (Teacher only)
router.post("/upload", protectRoute, upload.single("file"), uploadMaterial);

// 🧩 Get all materials
router.get("/", protectRoute, getAllMaterials);

export default router;
