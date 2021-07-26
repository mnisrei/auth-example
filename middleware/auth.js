const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

//creating protected response middleware
exports.protect = async (req, res, next) => {
    let token;
    // checking if token started with Bearer (authorization call)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
    try {
        //decoding token if found in headers
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded: ",decoded.id);

        //checking if user is present in db with the id we got in token
        const user = await User.findById(decoded.id);

        // if user found or not is written below
        if (!user) {
            return next(new ErrorResponse("No user found with this id", 404));
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new ErrorResponse("Not authorized to access this route", 401));
    }
}