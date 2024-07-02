const express = require("express");
const router = express.Router();

// import controllers and middleware
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { createBlog } = require("../controllers/Blog");

// route handler
router.post("/createBlog", authMiddleware, createBlog);



// export 
module.exports = router;