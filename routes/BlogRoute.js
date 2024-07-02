const express = require("express");
const router = express.Router();

// import controllers and middleware
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { createBlog, deleteBlog } = require("../controllers/Blog");

// route handler
router.post("/createBlog", authMiddleware, createBlog);
router.delete("/deleteBlog/:id", authMiddleware, deleteBlog);


// export 
module.exports = router;