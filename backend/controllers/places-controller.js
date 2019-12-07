const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "The Manor",
    description: "The house, before it was built...",
    imageURL:
      "https://geo3.ggpht.com/cbk?panoid=BX8ZnmgBQbRy8XD4-0-qLw&output=thumbnail&cb_client=search.gws-prod.gps&thumb=2&w=408&h=240&yaw=93.37958&pitch=0&thumbfov=100",
    address: "5019 Manor Stone Ln.",
    location: {
      lat: 29.5099105,
      lng: -95.8001341
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Flatiron",
    description: "Miss it.",
    imageURL:
      "https://lh5.googleusercontent.com/p/AF1QipOMim5bmXED53yBrsSTqGwgOIzg_jdHMgUSvx6y=w408-h272-k-no",
    address: "807 Main St.",
    location: {
      lat: 29.7589609,
      lng: -95.363447
    },
    creator: "u2"
  }
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.id;

  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    return next(new HttpError("No place with that ID pal :(", 404));
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.id;

  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("No places for a user with that ID pal :(", 404));
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Fix your inputs comrade", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Fix your patch inputs comrade", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError(
      "Acquaintance, couldn't find a place with that ID",
      404
    );
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(200).json({ message: "Place deleted!!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
