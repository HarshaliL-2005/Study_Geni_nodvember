import express from "express";
import {
  register,
  login,
  getMe
} from "../controllers/auth.controllers.js"; // Your auth controller
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🧩 Register a new user
router.post("/register", register);

// 🧩 Login existing user
router.post("/login", login);

// 🧩 Get current logged-in user info
router.get("/me", protectRoute, getMe);

export default router;
