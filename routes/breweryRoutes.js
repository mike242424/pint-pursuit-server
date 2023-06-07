const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const checkRole = require("../middleware/checkRole");
const breweryController = require("../controllers/breweryController");

const router = express.Router();

router
  .route("/")
  .get(checkAuth, breweryController.getBreweries)
  .post(checkAuth, checkRole, breweryController.addBrewery);

router
  .route("/:breweryId")
  .get(checkAuth, breweryController.getBrewery)
  .patch(checkAuth, checkRole, breweryController.updateBrewery)
  .delete(checkAuth, checkRole, breweryController.deleteBrewery);

module.exports = router;
