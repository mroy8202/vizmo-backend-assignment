const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true
    },
    blogImage: {
        type: String
    },
    blogImagePublicId: {
        type: String
    },
    blogContent: {
        type: String,
        required: true
    },
    blogPostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    } 
}, {timestamps: true});

module.exports = mongoose.model("Blog", blogSchema);