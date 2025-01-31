const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
               _id: mongoose.Schema.Types.ObjectId,     // comment id
               video_id: {type: String, required:true}, // video id
               user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // user id
               commentText: {type: String, required: true},   // comment text
},{timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);