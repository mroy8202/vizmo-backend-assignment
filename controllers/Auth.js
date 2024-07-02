const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();

// signup controller
exports.signup = async (req, res) => {
    try {
        // fetch all the data from request body
        const { name, username, email, password } = req.body;


        // validate all the data
        if(!name || !username || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "Please fill all the details, all fields are required."
            });
        };

        // check if the user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered"
            });
        }

        // check if the username already exists
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken, Please try again with different username"
            });
        }

        // hash the password using bcrypt with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // create an user entry in database
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        // return a successfull response
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            data: user
        });
    } catch (error) {
        console.log("Error while sign in the user: ", error);
        return res.status(500).json({
            success: false,
            message: "User registration failed, Please try again later"
        })
    }
}

// login controller
exports.login = async (req, res) => {
    try {
        // fetch all the data from the request body
        const { email, password } = req.body;

        // validate all the data
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details, all fields are required."
            });
        }

        // check if user exists or not
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first"
            });
        }

        // match the password
        const isMatchingPassword = await bcrypt.compare(password, user.password);
        if(!isMatchingPassword) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            });
        }

        // generate jsonwebtoken
        const payload = {
            email: user.email,
            id: user.id,
            username: user.username
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "48h" });

        // save the token in user's database
        user.token = token;
        user.password = undefined;

        // set cookie for token
        const options = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        console.log("User: ", user);

        // return a successfull response
        return res.cookie("token", token, options).status(200).json({
            success: true,
            token: token,
            user: user,
            message: "Logged in successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User login failed, please try again."
        })
    }
}