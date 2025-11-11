import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

// ✅ Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  let token;

  // 1️⃣ Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user to request object (without password)
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
