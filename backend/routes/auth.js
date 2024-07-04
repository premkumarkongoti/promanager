const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verifyJwtToken = require("../middlewares/authMiddleware");

// Endpoint to register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Bad Request: Missing required fields",
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.SECRET_KEY
    );

    // Respond with success
    res.json({
      message: "User successfully registered",
      token: token,
      username: savedUser.name,
      success: true,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({
      message: "Registration failed. Please try again later.",
      success: false,
    });
  }
});

// Endpoint to login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Bad Request: Invalid credentials",
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Handle user not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Handle incorrect password
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    // Respond with success
    res.json({
      message: "User logged in successfully",
      token: token,
      username: user.name,
      success: true,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(400).json({
      message: "Login failed. Please try again later.",
      success: false,
    });
  }
});

// Endpoint to update user information (password or name)
router.put("/settings/update", verifyJwtToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    const { name, password } = req.body;

    // Validate input
    if (!name && !password) {
      return res.status(400).json({
        message: "Bad Request: Missing update fields",
        success: false,
      });
    }

    // Find user by userId
    const user = await User.findById(userId);

    // Handle user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update user's name if provided
    if (name) {
      user.name = name;
    }

    // Update user's password if provided
    if (password && password.oldPassword && password.newPassword) {
      // Verify old password
      const isMatch = await bcrypt.compare(
        password.oldPassword,
        user.password
      );

      // Handle incorrect old password
      if (!isMatch) {
        return res.status(400).json({
          message: "Old password is incorrect",
          success: false,
        });
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(password.newPassword, 10);
      user.password = hashedPassword;
    }

    // Save updated user details
    await user.save();

    // Respond with success
    res.json({
      message: "User information updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({
      message: "Update failed. Please try again later.",
      success: false,
    });
  }
});

module.exports = router;
