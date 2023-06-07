const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST - signs a new user up
exports.signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const newUser = await User.create({
      email,
      username,
      password,
      role: "user",
    });

    const token = createToken(newUser._id);

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Please provide an email, username, and password",
      });
    } else {
      const user = await User.findOne({ email }).select("-password");

      return res.status(201).json({
        token,
        newUser,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// POST - logs an existing user in
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a username and password" });
    } else {
      const foundUser = await User.findOne({ username }).select("+password");

      if (
        !foundUser ||
        !(await foundUser.correctPassword(password, foundUser.password))
      ) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      } else {
        const token = createToken(foundUser._id);

        const user = await User.findOne({ username }).select("-password");

        return res.status(200).json({
          token,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
