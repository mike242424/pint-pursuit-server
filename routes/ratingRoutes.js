const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const ratingController = require("../controllers/ratingController");

const router = express.Router();

router.route("/").get(checkAuth, ratingController.getRatings);

router
  .route("/:ratingId")
  .patch(checkAuth, ratingController.updateRating)
  .delete(checkAuth, ratingController.deleteRating);

router
  .route("/breweries/:breweryId")
  .post(checkAuth, ratingController.addRating);

module.exports = router;
