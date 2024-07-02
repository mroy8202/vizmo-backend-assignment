const express = require("express");
const app = express();

require("dotenv").config();

const port = process.env.PORT || 4000;

// activate server
app.listen(process.env.port, () => {
    console.log(`App is running at port ${port}`)
})

// default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Welcome to default route"
    })
})