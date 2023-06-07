const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

require("dotenv").config();

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;

    const user = await User.findOne({ _id: id }).select("+role");

    if (!user) {
      return res.status(401).json({ message: "Authorization Failed" });
    } else req.userData = user;
    return next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = checkAuth;
