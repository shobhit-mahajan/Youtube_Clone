const express = require('express');
const Router = express.Router();
const checkAuth = require('../middleware/checkAuth.middleware');
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment.model');  // Assuming you have a comment model
const User = require('../models/User.model');  // Assuming you have a user model
const mongoose = require('mongoose');

// Add a new comment
Router.post('/new-comment/:videoId', checkAuth, async (req, res) => {
  try {
    const newComment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      video_id: req.params.videoId,
      user_id: req.body.user_id,
      commentText: req.body.commentText,
    }, { timestamps: true });

    const savedComment = await newComment.save();
    res.status(200).json({ message: "Comment saved successfully", comment: savedComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch comments for a video
Router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ video_id: req.params.videoId }).populate('user_id');
    res.status(200).json({ comments: comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error while fetching comments" });
  }
});

// Update a comment
Router.put('/:commentId', checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const users = await jwt.verify(token, process.env.JWT_KEY);
    const comment = await Comment.findById(req.params.commentId);

    if (comment.user_id.toString() === users._id.toString()) {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { commentText: req.body.commentText },
        { new: true }
      );
      res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } else {
      res.status(403).json({ message: "You are not authorized to update this comment" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a comment
Router.delete('/:commentId', checkAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const users = await jwt.verify(token, process.env.JWT_KEY);
    const comment = await Comment.findById(req.params.commentId);

    if (comment.user_id.toString() === users._id.toString()) {
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json({ message: "Comment deleted successfully" });
    } else {
      res.status(403).json({ message: "You are not authorized to delete this comment" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = Router;
