const express = require("express");
const app = express();

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/UserRoute")
const blogRoutes = require("./routes/BlogRoute");

require("dotenv").config();

const port = process.env.PORT || 4000;

// connect to database
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// connect with cloudinary
cloudinaryConnect();

// mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Welcome to default route"
    });
});

// activate server
app.listen(process.env.port, () => {
    console.log(`App is running at port ${port}`);
});