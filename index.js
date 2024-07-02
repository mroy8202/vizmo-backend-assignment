const express = require("express");
const app = express();

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary")

require("dotenv").config();

const port = process.env.PORT || 4000;

// connect to database
database.connect();

// connect with cloudinary
cloudinaryConnect();

// activate server
app.listen(process.env.port, () => {
    console.log(`App is running at port ${port}`);
});

// default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Welcome to default route"
    });
});