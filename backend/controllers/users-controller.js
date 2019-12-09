const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// NO MORE SEED DATA, IT IS NO LONGER THE WAY
// const DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "Joshua L. Hill",
//     email: "test@test.com",
//     password: "testers"
//   }
// ];

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

  const createdUser = new User({
    name,
    email,
    password,
    // image, ----- IF UNCOMMENTED, PUT image BACK INTO THE req.body DESTRUCTURING
    places: []
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log(error);
    error = new HttpError("Signup didn't work colleague", 500);
    return next(error);
  }

  // DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("Logging in no bueno", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Bad creds buddy", 401);
    return next(error);
  }

  res.json({
    message: "logged in my friend",
    user: existingUser.toObject({ getters: true })
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
