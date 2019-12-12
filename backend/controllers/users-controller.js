const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Did not collect all users", 500);
    return next(error);
  }
  res.json({
    users: users.map(user => user.toObject({ getters: true }))
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Fix your signup inputs comrade", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("Signing up no bueno", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exists :P", 422);
    return next(error);
  }

  let hashedPass;
  try {
    hashedPass = await bcrypt.hash(password, 12);
  } catch (e) {
    const error = new HttpError(
      "Couldn't create user, give it another try",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPass,
    image: req.file.path,
    places: []
  });

  try {
    await createdUser.save();
  } catch (error) {
    error = new HttpError("Signup didn't work colleague", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email
      },
      process.env.JOT_KEY,
      { expiresIn: "1h" }
    );
  } catch (e) {
    error = new HttpError("Signup didn't work colleague", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("No dice on the login", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Bad creds buddy", 403);
    return next(error);
  }

  let isValidPass = false;
  try {
    isValidPass = await bcrypt.compare(password, existingUser.password);
  } catch (e) {
    const error = new HttpError("Incorrect credentials", 500);
    return next(error);
  }

  if (!isValidPass) {
    const error = new HttpError("Bad creds", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email
      },
      process.env.JOT_KEY,
      { expiresIn: "1h" }
    );
  } catch (e) {
    error = new HttpError("Logging in didn't work colleague", 500);
    return next(error);
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
