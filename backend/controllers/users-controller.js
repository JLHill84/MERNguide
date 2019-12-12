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
    const error = new HttpError("did not collect all users", 500);
    return next(error);
  }
  res.json({
    users: users.map(user => user.toObject({ getters: true }))
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("fix inputs", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("sign-up failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("a user with that email already exists", 422);
    return next(error);
  }

  let hashedPass;
  try {
    hashedPass = await bcrypt.hash(password, 12);
  } catch (e) {
    const error = new HttpError(
      "user creation failed",
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
    error = new HttpError("sign-up failed", 500);
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
    error = new HttpError("sign-up failed", 500);
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
    const error = new HttpError("login failed", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("invalid credentials", 403);
    return next(error);
  }

  let isValidPass = false;
  try {
    isValidPass = await bcrypt.compare(password, existingUser.password);
  } catch (e) {
    const error = new HttpError("invalid credentials", 500);
    return next(error);
  }

  if (!isValidPass) {
    const error = new HttpError("invalid credentials", 403);
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
    error = new HttpError("login failed", 500);
    return next(error);
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
