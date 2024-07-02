const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = async (req, res, next) => {
    try {
        // Extract the token
        const token = req.cookies.token
                    || req.body.token
                    || req.header("Authorization").replace("Bearer ", "");

        if(!token || token === undefined) {
            return res.status(400).json({
                success: false,
                message: "Token is missing"
            });
        }
        // console.log("Token: ", token);
        // verify the token
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken;
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Token is invalid",
                err: err.message,
            });
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong while validating the token",
            error: error.message
        });
    }
};