import jwt from "jsonwebtoken";
import User from "../models/user.models.js"; // ✅ ensure correct file name

// ✅ Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// 🧩 REGISTER a new user (teacher or student)
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1️⃣ Validation
        if (!name || !email || !password || !role)
            return res.status(400).json({ message: "All fields are required" });

        // 2️⃣ Check if user already exists
        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Email already registered" });

        // 3️⃣ Create and save new user
        const user = await User.create({ name, email, password, role });

        // 4️⃣ Respond with token
        res.status(201).json({
            success: true,
            message: "Registered successfully",
            token: generateToken(user),
        });
    } catch (err) {
        console.error("❌ Register Error:", err); // Debug line to see full error in console
        res.status(500).json({ message: err.message });
    }
};

// 🧩 LOGIN an existing user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Find user
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid email or password" });

        // 2️⃣ Compare password
        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid email or password" });

        // 3️⃣ Send token
        res.json({
            success: true,
            message: "Login successful",
            token: generateToken(user),
        });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: err.message });
    }
};

// 🧩 GET current logged-in user info (using token)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error("❌ GetMe Error:", err);
        res.status(500).json({ message: err.message });
    }
};
