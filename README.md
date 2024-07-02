# Vizmo Backend Assignment

This project is a backend application built using Node.js, Express, and MongoDB for managing user authentication and blog posts. It provides APIs for user signup, login, blog creation, update, deletion, and fetching.

## Getting Started

To get the project up and running locally, follow these steps:

### Prerequisites

- Node.js installed on your machine
- MongoDB Atlas account (or local MongoDB installation)
- Cloudinary account for image storage (optional, but integrated)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/mroy8202/vizmo-backend-assignment.git
   cd vizmo-backend-assignment
   ```

2. Install dependencies:
    ```
    npm install
    ```

3. Set up environment variables:
   Create a .env file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URL=your_mongodb_connection_url
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   FOLDER_NAME=your_cloudinary_folder_name
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server: 
   ```
   npm run dev
   ```


## Endpoints
- `/signup`: User registration endpoint.
- `/login`: User login endpoint.
- `/createBlog`: Endpoint to create a new blog post.
- `/deleteBlog/:id`: Endpoint to delete a blog post by ID.
- `/updateBlog/:id`: Endpoint to update a blog post by ID.
- `/getBlog/:id`: Endpoint to fetch a single blog post by ID.
- `/getAllBlogs`: Endpoint to fetch all blog posts.
- `/getFilteredBlogs`: Endpoint to fetch filtered blog posts (by title or user).

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary for image storage
- JWT for authentication
- bcrypt for password hashing

