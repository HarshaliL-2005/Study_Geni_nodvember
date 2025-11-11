import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "../config/db.js";

// Routes
import authRoutes from "../routes/auth.routes.js";
import fileRoutes from "../routes/file.routes.js";
import materialRoutes from "../routes/material.routes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Log which DB we are connected to (for debug)
mongoose.connection.once("open", () => {
  console.log("Connected to Database:", mongoose.connection.name);
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/materials", materialRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("StudyGeni Backend is Running Successfully!");
});

// PORT
const PORT = process.env.PORT || 5000;

// Run server (for local development)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// For Vercel deployment: export the app instead of listening
export default app;
