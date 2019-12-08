const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

// ALL SEED DATA HAS BEEN REPLACED BY MONGODB
// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "The Manor",
//     description: "The house, before it was built...",
//     imageURL:
//       "https://geo3.ggpht.com/cbk?panoid=BX8ZnmgBQbRy8XD4-0-qLw&output=thumbnail&cb_client=search.gws-prod.gps&thumb=2&w=408&h=240&yaw=93.37958&pitch=0&thumbfov=100",
//     address: "5019 Manor Stone Ln.",
//     location: {
//       lat: 29.5099105,
//       lng: -95.8001341
//     },
//     creator: "u1"
//   },
//   {
//     id: "p2",
//     title: "Flatiron",
//     description: "Miss it.",
//     imageURL:
//       "https://lh5.googleusercontent.com/p/AF1QipOMim5bmXED53yBrsSTqGwgOIzg_jdHMgUSvx6y=w408-h272-k-no",
//     address: "807 Main St.",
//     location: {
//       lat: 29.7589609,
//       lng: -95.363447
//     },
//     creator: "u2"
//   }
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.id;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Call the DBA...", 404));
  }

  if (!place) {
    return next(new HttpError("No place with that ID pal :(", 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(new HttpError("Fetching failed friend-o", 500));
  }

  if (!places || places.length === 0) {
    return next(new HttpError("No places for a user with that ID pal :(", 404));
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Fix your inputs comrade", 422));
  }

  const { title, description, address, image, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    image,
    address,
    location: coordinates,
    creator
  });

  try {
    await createdPlace.save();
  } catch (error) {
    console.log(error);
    error = new HttpError("It didn't work colleague", 500);
    return next(error);
  }

  // this code was for the static seed data version
  // it was replaced by the above Place and try/catch block
  // DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Fix your patch inputs comrade", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  // SEED DATA NO LONGER BEING UTILIZED
  // const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Bad times", 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (e) {
    const error = new HttpError("Bad times on the save", 500);
    return next(error);
  }

  // DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Bad times delete find", 500);
    return next(error);
  }

  try {
    await place.remove();
  } catch (e) {
    const error = new HttpError("Bad times on the save", 500);
    return next(error);
  }

  res.status(200).json({ message: "Place deleted!!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
