const express = require("express");
const { check } = require("express-validator");

const placesController = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/:id", placesController.getPlaceById);

router.get("/user/:id", placesController.getPlacesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    (check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 4 }),
    check("address")
      .not()
      .isEmpty())
  ],
  placesController.createPlace
);

router.patch(
  "/:pid",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 4 })
  ],
  placesController.updatePlace
);

router.delete("/:pid", placesController.deletePlace);

module.exports = router;
