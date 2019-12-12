const axios = require("axios");



const HttpError = require("../models/http-error");

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_KEY}`
  );
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("adress not found", 422);
    return next(error);
  }

  console.log(data);

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
