const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message
    console.log(`Caught Error: ${err}`);
    //Error in DB Duplicate key value pair
    if (err.code === 11000) {
        const message = "Duplicate Field Value Entered";
        error = new ErrorResponse(message, 400);
    }

    //Mongoose Validatioin errors 
    if (err.name === "ValidationError") {
        console.log(`Validation error: ${err.errors}`);
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }

    // Either any of the above errors or other errors treated as Server Errors
    res.status(error.status || 500).json({
        success: false,
        error: error.message || "Server Error"
    });
}

module.exports = errorHandler;