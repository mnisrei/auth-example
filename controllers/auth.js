const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
    const { username, password, email } = req.body;
    try {
        const user = await User.create({
            username, email, password
        });
        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Please provide email and password", 400));
    };

    try {
        const user = await User.findOne({ email }).select("+password");
        console.log("Login User: ", user);
        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        const isMatches = await user.matchPassword(password);
        if (!isMatches) {
            return next(new ErrorResponse("Invalid credentials", 401));

        }
        sendToken(user, 200, res);
    }
    catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};
exports.forgotPassword = (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await USer.findOne({ email });

        if (!user) {
            return next(new ErrorResponse("Email could not be found", 404));
        }
        //get the reset token and also update the token in the database
        const resetToken = user.getResetPasswordToken();

        //now save the user data currently with resetToken and expirytime in it
        await user.save();

        //sending email with reset token
        const resetURL = `${process.env.RESETURL}/${resetToken}`;
        const message = `
        <h1> You have requested a password reset<h1>
        <p>Please go to the following link<p>
        <a href=${resetUrl} clicktracking=off>Reset Password</a>
        `
        try{
            
        }catch(error){

        }

    } catch (error) {

    }
};
exports.resetPassword = (req, res, next) => {
    res.send("resetPassword route");
};

//Sending Token

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token })
}