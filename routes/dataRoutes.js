const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const dataController = require("../controllers/dataController");

const router = express.Router();

router.route("/").post(checkAuth, dataController.addBreweryData);

module.exports = router;
