const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

//@desc Register a user
//@route Post /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check for missing fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are mandatory!" });
  }

  // Check if user is already registered
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "User already registered!" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return user data if created successfully
    res.status(201).json({ _id: user.id, email: user.email });
  } catch (error) {
    // Handle any errors that occur during user creation
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

//@desc Login user
//@route Post /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  res.json({ message: "Login user" });
});

//@desc Current user info
//@route Post /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current user information" });
});

module.exports = { registerUser, loginUser, currentUser };
