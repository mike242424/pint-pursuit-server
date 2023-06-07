const Brewery = require("../models/breweryModel");
const Rating = require("../models/ratingModel");

// Get - get ratings
exports.getRatings = async (req, res) => {
  try {
    const { ratingId, breweryId } = req.query;
    const ratingResults = {};

    if (ratingId) {
      ratingResults._id = ratingId;
    }

    if (breweryId) {
      ratingResults.breweryId = breweryId;
    }

    const ratings = await Rating.find(ratingResults).populate("brewery");

    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ message: "No ratings found" });
    } else {
      return res.status(200).json({ ratings });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST - add a rating
exports.addRating = async (req, res) => {
  try {
    const { breweryId } = req.params;
    const { rating, review } = req.body;

    const newRating = await Rating.create({
      createdBy: req.userData.username,
      breweryId,
      rating,
      review,
    });

    const brewery = await Brewery.findById({ _id: breweryId });

    if (!brewery) {
      res.status(404).json({ message: "No brewery found" });
    } else {
      const updatedReviews = Array.from(brewery.reviews);
      updatedReviews.unshift(newRating._id);
      brewery.set({ reviews: updatedReviews });
      const ratingReview = await brewery.save();

      res.status(201).json({ newRating });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH - update a brewery rating
exports.updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;

    const updatedRating = await Rating.findOneAndUpdate(
      { _id: ratingId, createdBy: req.userData.username },
      { rating: req.body.rating, review: req.body.review },
      { new: true }
    );

    if (!updatedRating) {
      return res.status(404).json({ message: "Rating was not found" });
    } else {
      return res.status(200).json({ updatedRating });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE - delete a brewery rating
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;

    const rating = await Rating.findOne({
      _id: ratingId,
      createdBy: req.userData.username,
    });

    if (!rating) {
      return res.status(404).json({ message: "No rating found" });
    } else {
      const breweryId = rating.breweryId;
      const brewery = await Brewery.findOne({ _id: breweryId });

      brewery.set({
        reviews: brewery.reviews.filter((review) => {
          return review.toString() !== ratingId.toString();
        }),
      });

      await brewery.save();

      await rating.deleteOne();

      return res.status(200).json({ message: "Review deleted" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
