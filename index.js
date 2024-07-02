const express = require("express");
const app = express();

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

const userRoutes = require("./routes/UserRoute")

require("dotenv").config();

const port = process.env.PORT || 4000;

// connect to database
database.connect();

// middlewares
app.use(express.json());

// connect with cloudinary
cloudinaryConnect();

// mount routes
app.use("/api/v1/auth", userRoutes);

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