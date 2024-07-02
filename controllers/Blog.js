const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const { uploadImageToCloudinary } = require("../config/cloudinary");
require("dotenv").config();

// create a new blog post
exports.createBlog = async (req, res) => {
    try {
        // fetch user id
        const userId = req.user.id;

        // fetch user
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Please login first to post a blog",
                data: user
            });
        }

        // fetch blogTitle and blogContent
        const { blogTitle, blogContent } = req.body;
        if(!blogTitle || !blogContent) {
            return res.status(500).json({
                success: false,
                message: "Title or Content is missing"
            });
        }
        
        // fetch image if available
        let imageUrl = null;
        if(req.files && req.files.blogImage) {
            const photo = req.files.blogImage;
            // if image is available, upload to cloudinary
            const image = await uploadImageToCloudinary(photo, process.env.FOLDER_NAME);
            imageUrl = image.secure_url;
        }

        // create entry in Blog database
        const blog = await Blog.create({
            blogTitle,
            blogImage: imageUrl,
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