// const crpto = require("crypto");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//** NOTE: Always remember to user function keyword in db instead of "fat arrow function" ** //
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        requred: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
UserSchema.pre("save", async function (next) {
    //if some data is modified for eg. resettoken it'll not encrypt again instead it'll run next()
    if (!this.isModified("password")) {
        next();
    }

    //this will only run if password is modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();

});
// Compairs the input password and the user found password in auth controllers
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// creating token
UserSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE, })
}

//generating reset token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = require("crypto").randomBytes(20).toString("hex");
    this.resetPasswordToken = require("crypto").createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
}
const User = mongoose.model("User", UserSchema);
module.exports = User;
