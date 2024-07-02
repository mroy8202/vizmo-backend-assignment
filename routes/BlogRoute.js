const express = require("express");
const router = express.Router();

// import controllers and middleware
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { createBlog, deleteBlog, updateBlog, getBlog, getAllBlogs, getFilteredBlogs } = require("../controllers/Blog");

// route handler
router.post("/createBlog", authMiddleware, createBlog);
router.delete("/deleteBlog/:id", authMiddleware, deleteBlog);
router.put("/updateBlog/:id", authMiddleware, updateBlog);
router.get("/getBlog/:id", getBlog);
router.get("/getAllBlogs", getAllBlogs);
router.get("/getFilteredBlogs", getFilteredBlogs);

// export 
module.exports = router;