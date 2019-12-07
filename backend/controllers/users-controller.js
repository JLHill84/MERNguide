const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Joshua L. Hill",
    email: "test@test.com",
    password: "testers"
  }
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Fix your signup inputs comrade", 422);
  }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);

  if (hasUser) {
    throw new HttpError("Email already in use amigo", 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password === password) {
    throw new HttpError("User not found, check your creds", 401);
  }

  res.json({ mesage: "logged in my friend" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
