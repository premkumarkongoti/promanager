// const express = require("express");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/auth");
// const taskRoutes = require("./routes/task");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));


// // Health API
// app.get("/health", (req, res) => {
//   return res.json({
//     message: "Your API is running successfully!",
//   });
// });
 
// // Connect DB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("Successfully connected to the DB");
//   })
//   .catch((err) => {
//     console.error("Some error occurred while connecting to the DB", err);
//   });

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/tasks", taskRoutes);
 
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, (error) => {
//   if (!error) {
//     console.log(`Server is running at the port ${PORT}`);
//   }
// });
  



















const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health Check API
app.get("/health", (req, res) => {
  return res.json({
    message: "Your API is running successfully!",
  });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Successfully connected to the database");
})
.catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1); // Exit on connection failure
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    success: false,
  }); 
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
