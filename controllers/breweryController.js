const Brewery = require("../models/breweryModel");

// GET - get breweries
exports.getBreweries = async (req, res) => {
  try {
    const { name, city, state, sort_by, page, limit } = req.query;
    const sortBreweries = {};
    const breweryResults = {};

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (name) {
      breweryResults.name = new RegExp(name, "i");
    }

    if (city) {
      breweryResults.city = new RegExp(city, "i");
    }

    if (state) {
      breweryResults.state = new RegExp(state, "i");
    }

    if (sort_by) {
      if (sort_by === "date_desc") {
        sortBreweries.createdAt = "desc";
      } else if (sort_by === "date_asc") {
        sortBreweries.createdAt = "asc";
      } else if (sort_by === "name_asc") {
        sortBreweries.name = "asc";
      } else if (sort_by === "name_desc") {
        sortBreweries.name = "desc";
      }
    }

    if (name === null && city === null && state === null) {
      return;
    } else {
      const breweries = await Brewery.find(breweryResults)
        .sort(sortBreweries)
        .populate("reviews")
        .skip(startIndex)
        .limit(limit);

      const totalBreweries = await Brewery.countDocuments(breweryResults);

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalBreweries / limit),
      };

      if (!breweries) {
        res.status(404).json({ message: "No breweries were found" });
      } else {
        res.status(200).json({ breweries, pagination });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get - get brewery by id
exports.getBrewery = async (req, res) => {
  try {
    const { breweryId } = req.params;
    const brewery = await Brewery.findOne({ _id: breweryId }).populate(
      "reviews"
    );

    if (!brewery) {
      return res.status(404).json({ message: "No brewery was found" });
    } else {
      return res.status(200).json({ brewery });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// POST - add a brewery
exports.addBrewery = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      country,
      longitude,
      latitude,
      phone,
      websiteUrl,
    } = req.body;

    const newBrewery = await Brewery.create({
      name,
      address,
      city,
      state,
      zipCode,
      country,
      longitude,
      latitude,
      phone,
      websiteUrl,
      reviews: [],
      totalRating: 0,
    });

    res.status(201).json({ newBrewery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH - update brewery information
exports.updateBrewery = async (req, res) => {
  const { breweryId } = req.params;
  const {
    name,
    address,
    city,
    state,
    zipCode,
    country,
    longitude,
    latitude,
    phone,
    websiteUrl,
  } = req.body;

  try {
    const updatedBrewery = await Brewery.findByIdAndUpdate(
      { _id: breweryId },
      {
        name,
        address,
        city,
        state,
        zipCode,
        country,
        longitude,
        latitude,
        phone,
        websiteUrl,
      },
      { new: true }
    );

    if (!updatedBrewery) {
      return res.status(400).json({ message: "No breweries were found" });
    } else {
      res.status(200).json({ updatedBrewery });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE - delete a brewery
exports.deleteBrewery = async (req, res) => {
  try {
    const { breweryId } = req.params;

    const brewery = await Brewery.findOne({ _id: breweryId }).populate(
      "reviews"
    );

    if (!brewery) {
      return res.status(404).json({ message: "No breweries were found" });
    } else {
      if (brewery.reviews.length > 0) {
        brewery.reviews.map((review) => {
          review.deleteOne();
        });
      }

      brewery.deleteOne();

      return res.status(200).json({ message: "Brewery deleted" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
