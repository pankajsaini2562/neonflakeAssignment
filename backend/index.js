import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import cors from "cors";
import databaseConnection from "./config/database.js";
import { v2 as cloudinary } from "cloudinary";
databaseConnection();
const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("server is running succesfully at 3000!!");
});

// MongoDB Schema
const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 200 },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
});
const Media = mongoose.model("Media", mediaSchema);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer Setup
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Upload Media API
app.post(
  "/upload",
  upload.fields([{ name: "thumbnail" }, { name: "video" }]),
  async (req, res) => {
    try {
      const { title, description } = req.body;

      // Upload thumbnail to Cloudinary
      const thumbnailResult = await cloudinary.uploader.upload(
        req.files.thumbnail[0].path,
        {
          resource_type: "image",
        }
      );

      // Upload video to Cloudinary
      const videoResult = await cloudinary.uploader.upload(
        req.files.video[0].path,
        {
          resource_type: "video",
        }
      );

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
      console.error("Error uploading media:", error);
      res.status(500).json({ message: "Error uploading media" });
    }
  }
);

// Get Media API
app.get("/media", async (req, res) => {
  try {
    const mediaList = await Media.find();
    res.status(200).json({ mediaList });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Error fetching media" });
  }
});
app.use(express.static(path.join(__dirname, "/frontend/dist")));

//join the path routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
