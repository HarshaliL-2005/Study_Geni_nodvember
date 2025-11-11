import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

import {
  uploadFile,
  getAllFiles,
  getFileById,
} from "../controllers/file.controllers.js";

import { getFileSummary, getFileQuiz } from "../controllers/ai.controllers.js";

const router = express.Router();

// 🧩 Multer setup for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// -----------------------
// File Management Routes
// -----------------------

// Upload a new file
router.post("/", protectRoute, upload.single("file"), uploadFile);

// Get all files
router.get("/", protectRoute, getAllFiles);

// Get single file by ID
router.get("/:fileId", protectRoute, getFileById);

// -----------------------
// AI Routes for Files
// -----------------------

// Get AI-generated summary
router.get("/:fileId/summary", protectRoute, getFileSummary);

// Get AI-generated quiz
router.get("/:fileId/quiz", protectRoute, getFileQuiz);

export default router;
