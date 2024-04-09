// Import required modules

const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnections");
const dotenv = require("dotenv").config();

// Establish connection to database
connectDb();
// Create an instance of express
const app = express();

// Define a port to listen on
const port = process.env.PORT || 5000;

app.use(express.json());

// Define a route
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use(errorHandler);
// Start the server
app.listen(port, () => {
  console.log(`Sever running on port ${port}`);
});
