const jwt = require('jsonwebtoken');    // import jwt for authentication
require('dotenv').config();             // import dotenv to use env variable

module.exports = async(req,res,next) => {
               try {
                        const token = req.headers.authorization.split(" ")[1];  // get token from jwt header
                        await jwt.verify(token, process.env.JWT_KEY);   // verify token and evn jwt key variable
                                    next();   
               } catch (error) {
                             console.log(error);
                             res.status(500).json({message: "Internal server error while checking authentication"}); 
               }
}