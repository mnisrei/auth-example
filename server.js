require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");

const errorHandler = require("./middleware/error")

// Connecting to Database
connectDB();
const app = express();
//Middlewares...........................
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));


//Error Handler Middleware (Should be last peice of middleware)
app.use(errorHandler);

//.................................
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    return console.log("Server is running at: ", PORT);
});

process.on("unhandledRejection", (err, promise) => {
    console.log("Logged Error: ", err);
    server.close(() => process.exit(1));
});