const axios = require("axios");
const Brewery = require("../models/breweryModel");

exports.populateDatabase = async () => {
  const response = await axios.get(
    "https://api.openbrewerydb.org/v1/breweries?page=1&per_page=200"
  );

  const data = response.data;

  for (let i = 0; i < data.length; i++) {
    if (
      data[i].name === null ||
      data[i].address_1 === null ||
      data[i].city === null ||
      data[i].state === null ||
      data[i].postal_code === null ||
      data[i].country === null ||
      data[i].longitude === null ||
      data[i].latitude === null ||
      data[i].phone === null ||
      data[i].website_url === null
    ) {
      continue;
    } else {
      await Brewery.create({
        name: data[i].name,
        address: data[i].address_1,
        city: data[i].city,
        state: data[i].state,
        zipCode: data[i].postal_code,
        country: data[i].country,
        longitude: data[i].longitude,
        latitude: data[i].latitude,
        phone: data[i].phone,
        websiteUrl: data[i].website_url,
        reviews: [],
      });
    }
  }
};
