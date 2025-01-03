import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import { v2 as cloudinary } from "cloudinary";

// Load environment variables
dotenv.config();

// Initialize database connection
databaseConnection();

// Initialize express app
const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(cors());

// MongoDB Schema
const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 200 },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
});
const Media = mongoose.model("Media", mediaSchema);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Media API
app.post(
  "/upload",
  upload.fields([{ name: "thumbnail" }, { name: "video" }]),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      // Upload thumbnail to Cloudinary
      const thumbnailResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.files.thumbnail[0].buffer);
      });

      // Upload video to Cloudinary
      const videoResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "video" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.files.video[0].buffer);
      });

      // Save to MongoDB
      const media = new Media({
        title,
        description,
        thumbnailUrl: thumbnailResult.secure_url,
        videoUrl: videoResult.secure_url,
      });

      await media.save();
      res.status(201).json({ message: "Media uploaded successfully", media });
    } catch (error) {
      console.error("Error uploading media:", error.message);
      res
        .status(500)
        .json({ message: "Error uploading media", error: error.message });
    }
  }
);

// Get Media API
app.get("/media", async (req, res) => {
  try {
    const mediaList = await Media.find();
    res.status(200).json({ mediaList });
  } catch (error) {
    console.error("Error fetching media:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching media", error: error.message });
  }
});

// Static File Serving for Frontend
app.use(express.static(path.resolve(__dirname, "./frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/dist/index.html"));
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}!!`);
});
