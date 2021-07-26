class ErrorResponse extends Error{
    constructor(message, statusCode){
        console.log("error response: ",message);
        super(message);
        this.statusCode=statusCode;
    }
}
module.exports = ErrorResponse;