import express from "express";
import { register, login, getMe } from "../controllers/auth.controllers.js"; // ✅ correct
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

// ✅ Register user (teacher or student)
router.post("/register", register);

// ✅ Login user
router.post("/login", login);

// ✅ Get logged-in user info (protected)
router.get("/me", protectRoute, getMe); // ✅ use protectRoute

export default router;
