const axios = require("axios");

const API_KEY = require('./.keys.js');

// const API_KEY = "AIzaSyBEm32aBiHXg3Lq8lm707guvOLvDXI1_ZA";

const HttpError = require("../models/http-error");

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("Couldn't find that address sadly", 422);
    throw error;
  }

  console.log(data);

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
