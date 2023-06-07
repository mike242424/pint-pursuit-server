const { populateDatabase } = require("../utils/populateDatabase");

// POST - populates database with data from Open Brewery DB
exports.addBreweryData = async (req, res) => {
  try {
    populateDatabase();

    res
      .status(200)
      .json({ message: "Data successfully inserted into MongoDB" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
