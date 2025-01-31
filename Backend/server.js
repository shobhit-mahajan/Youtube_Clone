const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const UserRoute = require("./Routes/User.route");
const VideoRoute = require("./Routes/Video.route");
const commentRoute = require("./Routes/Comment.route");
const cors = require("cors");

dotenv.config();   // dot configuration
const app = express();      // middleware
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],            //cors method
  })
);
const port = 3000;              // static port number
app.use(bodyParser.json());
app.use(                          // cloudniary middleware to upload file and images
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.get("/", (req, res) => {                           
  res.send("Hello World!");
});  
app.use("/user", UserRoute);   // user route
app.use("/video", VideoRoute);  // video route
app.use("/comment", commentRoute);  // comment route
 // mongodb database connection
const connectDatabase = async () => {         
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database");
  }
};
connectDatabase();
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
