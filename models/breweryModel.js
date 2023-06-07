const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brewerySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: String,
        ref: "Rating",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brewery", brewerySchema);
