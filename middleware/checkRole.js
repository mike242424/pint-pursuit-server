const checkRole = (req, res, next) => {
  try {
    console.log(req.userData);
    if (req.userData && req.userData.role === "admin") {
      next();
    } else {
      res
        .status(403)
        .json({ message: "You are not authorized to perform this action." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = checkRole;
