import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

// Optional: confirm configuration in development mode only
if (process.env.NODE_ENV !== "production") {
  console.log("✅ Cloudinary Config Loaded:", {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
    secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing",
  });
}

export default cloudinary;
