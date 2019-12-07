const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.id;
  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId;
  });

  if (!place) {
    return next(new HttpError("No user with that ID pal :(", 404));
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({place: createdPlace});
  res.
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
