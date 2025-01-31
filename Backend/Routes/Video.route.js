const express = require("express");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/checkAuth.middleware");
const jwt = require("jsonwebtoken");
const Video = require("../models/Video.model");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const Router = express.Router();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// fetch all video
Router.get("/", async (req, res) => {
  try {
    const { category, user_id } = req.query; // Extract user_id from query params

    let filter = {}; // Initialize empty filter object

    if (category) {
      filter.category = category;
    }

    if (user_id) {
      filter.user_id = user_id; // Filter videos by user_id if provided
    }

    // Fetch videos based on the filters and populate user details
    const videos = await Video.find(filter).populate(
      "user_id",
      "channelName _id"
    );

    if (!videos.length) {
      return res.status(404).json({ message: "No videos found." });
    }

    res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching videos." });
  }
});
// video search route
Router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query); // Get the search query from the request
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    // Perform a case-insensitive search
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// video fetch by id
Router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json({ video });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch video details" });
  }
});
// video upload
Router.post("/upload", checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const users = await jwt.verify(token, process.env.JWT_KEY);
    const uploadedVideo = await cloudinary.uploader.upload(
      req.files.video.tempFilePath,
      {
        resource_type: "video",
      }
    );
    console.log(uploadedVideo);
    const uploadedThumbnail = await cloudinary.uploader.upload(
      req.files.thumbnail.tempFilePath
    );

    const newVideo = new Video({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      description: req.body.description,
      user_id: users._id,
      videoUrl: uploadedVideo.secure_url,
      videoId: uploadedVideo.public_id,
      thumbnailUrl: uploadedThumbnail.secure_url,
      thumbnailId: uploadedThumbnail.public_id,
      category: req.body.category,
      tags: req.body.tags.split(","),
    });
    const uploadedNewVideo = await newVideo.save();
    res
      .status(200)
      .json({
        message: "Video uploaded successfully",
        video: uploadedNewVideo,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// update exsiting video detail route
Router.put("/:videoId", checkAuth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      tags: req.body.tags ? req.body.tags.split(",") : video.tags,
    };

    if (req.files && req.files.thumbnail) {
      await cloudinary.uploader.destroy(video.thumbnailId);
      const updatedThumbnail = await cloudinary.uploader.upload(
        req.files.thumbnail.tempFilePath
      );
      updatedData.thumbnailUrl = updatedThumbnail.secure_url;
      updatedData.thumbnailId = updatedThumbnail.public_id;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.videoId,
      updatedData,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Video updated successfully", video: updatedVideo });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error while updating video" });
  }
});
// video detail by video id route
Router.delete("/:videoId", checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const users = await jwt.verify(token, process.env.JWT_KEY);
    const video = await Video.findById(req.params.videoId);
    if (video.user_id == users._id) {
      await cloudinary.uploader.destroy(video.thumbnailId);
      await cloudinary.uploader.destroy(video.videoId);
      await Video.findByIdAndDelete(req.params.videoId);
      res.status(200).json({ message: "Video deleted successfully" });
    } else {
      return res
        .status(500)
        .json({ message: "You cannot Permission to delete Video" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error while deleting video" });
  }
});
// video like route
Router.put("/like/:videoId", checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const users = await jwt.verify(token, process.env.JWT_KEY);
    const video = await Video.findById(req.params.videoId);
    if (video.likedBy.includes(users._id)) {
      res.status(500).json({ message: "You have already liked this video" });
    }
    if (video.dislikedBy.includes(users._id)) {
      video.dislike -= 1;
      const index = video.dislikedBy.indexOf(users._id);
      video.dislikedBy.splice(index, 1);
    }
    video.likes += 1;
    video.likedBy.push(users._id);
    await video.save();
    res.status(200).json({ message: "liked" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error while liking video" });
  }
});
// video dislike route
Router.put("/dislike/:videoId", checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const users = await jwt.verify(token, process.env.JWT_KEY);
    const video = await Video.findById(req.params.videoId);
    if (video.dislikedBy.includes(users._id)) {
      res.status(500).json({ message: "You have already disliked this video" });
    }
    if (video.likedBy.includes(users._id)) {
      video.likes -= 1;
      const index = video.likedBy.indexOf(users._id);
      video.likedBy.splice(index, 1);
    }
    video.dislike += 1;
    video.dislikedBy.push(users._id);
    await video.save();
    res.status(200).json({ message: "disliked" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error while disliking video" });
  }
});

module.exports = Router;
