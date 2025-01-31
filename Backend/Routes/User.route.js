const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Video = require('../models/Video.model')
const { channel } = require('diagnostics_channel');
// cloudinary configuration 
cloudinary.config({ 
               cloud_name: process.env.CLOUD_NAME, 
               api_key: process.env.API_KEY, 
               api_secret:process.env.API_SECRET, 
           });

// get specific user  by user id 
Router.get('/:userId', async(req, res) => {
              try {
                const user = await User.findById(req.params.userId);
                res.status(200).json({channelName: user.channelName,  logoUrl: user.logoUrl,subscribers: user.subscribers,user});
              } catch (error) {
                console.log(error);
                res.status(500).json({message: "Internal server error"});
              }
            });

// route to register
Router.post('/signup', async(req, res) => {
              try {
                const users = await User.find({email: req.body.email});
                if(users.length>0) {
                    return res.status(500).json({message: "User already exists"});
                }
                              const PassHash = await bcrypt.hashSync(req.body.password, 10);
                            const uploadLogo =   await cloudinary.uploader.upload(req.files.logo.tempFilePath);
                            console.log(uploadLogo);
                              const user = new User({
                                             _id: new mongoose.Types.ObjectId(),
                                             channelName: req.body.channelName,
                                             email: req.body.email,
                                             phone: req.body.phone,
                                             password: PassHash,
                                             logoUrl: uploadLogo.secure_url,
                                             logoId: uploadLogo.public_id,
                              });
                              await user.save().then(result => {
                                             res.status(201).json({message: "User created successfully", user: result});   
              })
              } catch (error) {
                              console.log(error);
                              res.status(500).json({message: "Internal server error"});
              }
});
// login route
Router.post('/login', async(req, res) => {
            try {
                const users = await User.find({email: req.body.email});
                if(users.length==0) {
                    return res.status(500).json({message: "User does not exist"});
                }
                const isValid = await bcrypt.compareSync(req.body.password, users[0].password);
                if(!isValid) {
                    return res.status(500).json({message: "Invalid password"});
                }
                const token = jwt.sign({
                  _id: users[0]._id,
                  channelName: users[0].channelName,
                    email: users[0].email,
                    phone: users[0].phone,
                    logoId: users[0].logoId,
                }, process.env.JWT_KEY, {
                    expiresIn: "1h"
                });
              res.status(200).json({message: "Login successful", 
                _id: users[0]._id,
                channelName: users[0].channelName,
                  email: users[0].email,
                  phone: users[0].phone,
                  logoId: users[0].logoId,
                  logoUrl: users[0].logoUrl,
                  subscribers: users[0].subscribers,
                  subscribedChannels: users[0].subscribedChannels,
                token: token});
            } catch (error) {
              console.log(error);
              res.status(500).json({message: "Internal server error while logging in"});
            }
                               
                              });
// subscribe Route
Router.put('/subscribe/:userId', async(req, res) => {
            try {
              const users = await User.findById(req.params.userId);
              const token = req.headers.authorization.split(" ")[1];
              const decoded = await jwt.verify(token, process.env.JWT_KEY);
              const user = await User.findById(decoded._id);
              if(user.subscribedBy.includes(users._id)) {
                return res.status(500).json({message: "Already subscribed"});
              }
             user.subscribers += 1;
             user.subscribedBy.push(users._id);
             await user.save();
             const userFullInformation = await User.findById(users._id);
             userFullInformation.subscribedChannels.push(user._id);
             await userFullInformation.save();
              res.status(200).json({message: "Subscribed successfully"});

            } catch (error) {
              console.log(error);
              res.status(500).json({message: "Internal server error"});
            }
          });
// unsubscribe route
Router.put('/unsubscribe/:userId', async(req, res) => { 
            try {
              const users = await User.findById(req.params.userId);
              const token = req.headers.authorization.split(" ")[1];
              const decoded = await jwt.verify(token, process.env.JWT_KEY);
              const user = await User.findById(decoded._id  );  
              if(!user.subscribedBy.includes(users._id)) {
                return res.status(500).json({message: "You are not subscribed"});
              }
              user.subscribers -= 1;
              const index = user.subscribedBy.indexOf(users._id);
              user.subscribedBy.splice(index, 1);
              await user.save();
              const userFullInformation = await User.findById(users._id);
              const index1 = userFullInformation.subscribedChannels.indexOf(user._id);

              userFullInformation.subscribedChannels.splice(index1, 1);
              await userFullInformation.save();
              res.status(200).json({message: "Unsubscribed successfully"});
            } catch (error) {
              console.log(error);
              res.status(500).json({message: "Internal server error"});
            }
          }
);
// views update route
Router.put('/views/:videoId', async(req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    video.views += 1;
    await video.save();
    res.status(200).json({message: "Views updated successfully  "});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error while updating views"});
  }
});

module.exports = Router;