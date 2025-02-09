const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const { uploadImageToCloudinary } = require("../config/cloudinary");
const Cloudinary = require("cloudinary").v2;
require("dotenv").config();

// create a new blog post
exports.createBlog = async (req, res) => {
    try {
        // fetch user id
        const userId = req.user.id;

        // fetch user
        const user = await User.findById(userId);
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Please login first to post a blog",
                data: user
            });
        }

        // fetch blogTitle and blogContent
        const { blogTitle, blogContent } = req.body;
        if(!blogTitle || !blogContent) {
            return res.status(400).json({
                success: false,
                message: "Title or Content is missing"
            });
        }
        
        // fetch image if available
        let imageUrl = null;
        let imagePublicId = null;
        if(req.files && req.files.blogImage) {
            const photo = req.files.blogImage;
            // if image is available, upload to cloudinary
            const image = await uploadImageToCloudinary(photo, process.env.FOLDER_NAME);
            imageUrl = image.secure_url;
            imagePublicId = image.public_id;
        }

        // create entry in Blog database
        const blog = await Blog.create({
            blogTitle,
            blogImage: imageUrl,
            blogImagePublicId: imagePublicId,
            blogContent,
            blogPostedBy: userId
        });

        // add newly created Blog to the user's schema
        await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    userPosts: blog._id
                }
            }
        );

        // return a successfull response
        return res.status(200).json({
            success: true,
            message: "Blog created successfully",
            data: blog
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured while creating a blog"
        })
    }
};

// delete an existing blog post
exports.deleteBlog = async (req, res) => {
    try {
        // fetch blog id that has to be deleted
        const blogId = req.params.id;

        // check if blog is available in database with blogId
        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(401).json({
                success: false,
                message: "Blog not found with given blogId",
            });
        }

        // check if user is authorized to delete the post
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // console.log("BLOG USER ID: ", blog.blogPostedBy.toString(), " Type: ", typeof(blog.blogPostedBy.toString()));
        if(userId !== blog.blogPostedBy.toString()) {
            return res.status(403).json({
                success: false,
                message: "User is not authorized to delete the post",
            });
        }

        // delete blog image from cloudinary if available
        try {
            if(blog.blogImagePublicId !== null) {
                await Cloudinary.uploader.destroy(blog.blogImagePublicId);
            } 
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in deleting image from cloudinary",
                error: error.message
            });
        }

        // delete the blog
        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        // remove the blog from userBlog array
        const userBlog = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    userPosts: blogId
                }
            },
            {new: true}
        );

        // return a successfull response
        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            blog: deletedBlog
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured while deleting the blog",
            error: error.message
        });
    }
}

// update an existing blog post
exports.updateBlog = async (req, res) => {
    try {
        // fetch blog id that has to be updated
        const blogId = req.params.id;

        // check if blog is available in the database with blogId
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found with given blogId",
            });
        }

        // check if user is authorized to update the Blog
        const userId = req.user.id;
        if (userId !== blog.blogPostedBy.toString()) {
            return res.status(401).json({
                success: false,
                message: "User is not authorized to update the post",
            });
        }

        // fetch updated blogTitle and blogContent
        const { blogTitle, blogContent } = req.body;
        let updatedFields = {};
        if(blogTitle) updatedFields.blogTitle = blogTitle;
        if(blogContent) updatedFields.blogContent = blogContent;

        // fetch and update image if available
        if(req.files && req.files.blogImage) {
            const photo = req.files.blogImage;
            // delete old image from cloudinary if it exists
            if(blog.blogImagePublicId) {
                await Cloudinary.uploader.destroy(blog.blogImagePublicId);
            }

            // upload new image to cloudinary
            const image = await uploadImageToCloudinary(photo, process.env.FOLDER_NAME);
            updatedFields.blogImage = image.secure_url;
            updatedFields.blogImagePublicId = image.public_id;
        }

        // update the blog in the database
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $set: updatedFields },
            { new: true, runValidators: true } // makes sure that updated data adheres to schema's rules
        );

        // return a successful response
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating the blog",
            error: error.message
        });
    }
};

// Get details of a single blog post
exports.getBlog = async (req, res) => {
    try {
        // fetch blog id from the request parameters
        const blogId = req.params.id;

        // find the blog by id and populate the blogPostedBy field to get user details
        const blog = await Blog.findById(blogId).populate('blogPostedBy', 'name username email');

        // if blog not found, return a 404 response
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found with the given blogId"
            });
        }

        // return a successful response with blog details
        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching the blog",
            error: error.message
        });
    }
};

// Get all blog posts
exports.getAllBlogs = async (req, res) => {
    try {
        // fetch all blogs from the database and populate the blogPostedBy field to get user details
        const blogs = await Blog.find().populate('blogPostedBy', 'name username email');

        // check if blogs are in databases or not
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No blogs found"
            });
        }

        // return a successful response
        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching the blogs",
            error: error.message
        });
    }
};

// get filtered list of posts (filter by title, user)
exports.getFilteredBlogs = async (req, res) => {
    try {
        // Destructure the query parameters
        const { title, user } = req.query;
        
        // Build the filter object
        let filter = {};
        if(title) {
            filter.blogTitle = { $regex: title, $options: 'i' }; // case-insensitive regex search
        }
        if(user) {
            // Find the user by username and get the user ID
            const userObj = await User.findOne({ username: user });
            if (!userObj) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            filter.blogPostedBy = userObj._id;
        }

        // Fetch filtered blogs from the database and populate the blogPostedBy field to get user details
        const blogs = await Blog.find(filter).populate('blogPostedBy', 'name username email');

        // If no blogs found, return a response
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No blogs found matching the criteria"
            });
        }

        // Return a successful response with the filtered list of blogs
        return res.status(200).json({
            success: true,
            message: "Filtered blogs fetched successfully",
            data: blogs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching the filtered blogs",
            error: error.message
        });
    }
};



