const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendMails = require("../utils/sendEmail");


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
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    console.log(email);
    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return next(new ErrorResponse("Email could not be found", 404));
        }
        //get the reset token and also update the token in the database
        const resetToken = user.getResetPasswordToken();
        //now save the user data currently with resetToken and expirytime in it
        await user.save();
        //sending email with reset token
        const resetUrl = `${process.env.RESETURL}/${resetToken}`;
        const message = `
        <h1> You have requested a password reset<h1>
        <p>Please go to the following link<p>
        <a href=${resetUrl} clicktracking=off>${resetUrl} </a>
        `;
        try {
            await sendMails({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            });
            res.status(200).json({ success: true, data: "Email Sent" });
        } catch (error) {
            //if some problem occurs then reset the user
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            // and save it 
            await user.save();
            //returning the error with satus
            return next(new ErrorResponse("Email could not be send", 500));
        }

    } catch (error) {
        next(errors)
    }
};
exports.resetPassword = async (req, res, next) => {
    //converting the param's request token to same hash as of resetPasswordToken in User Schema created while forgotPassword is done
    const resetPasswordTokenFromParams = require("crypto").createHash("sha256").update(req.params.resetToken).digest("hex");

    console.log(resetPasswordTokenFromParams);
    try {
        // Finding the resetpasswordtoken from the user database and compairing expire date as well  
        const user = await User.findOne({
            resetPasswordToken: { $eq: resetPasswordTokenFromParams },
            resetPasswordExpire: { $gt: Date.now() }
        });
        //if user is not found error is thrown 
        if (!user) {
            return next(new ErrorResponse("Invalid Reset Token", 400));
        }
        //if user is found the password we got in put request body is set to the User schema of the found user and also token and expiry date is resetted
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(201).json({
            success: true,
            data: "Password Reset Success"
        })
    }
    catch (error) {
        next(error);
    }
};

//Sending Token

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token })
};