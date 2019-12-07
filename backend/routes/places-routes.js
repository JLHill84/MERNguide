const express = require("express");

const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/:id", placesControllers.getPlaceById);

router.get("/user/:id", placesControllers.getPlaceByUserId);

router.post('/', placesControllers.createPlace)

module.exports = router;
