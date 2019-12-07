const express = require("express");

const usersControllers = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post("/signup", usersControllers.signup);

router.post('/login', usersControllers.login)

router.patch("/:pid", usersControllers.updatePlace);

router.delete("/:pid", usersControllers.deletePlace);

module.exports = router;
