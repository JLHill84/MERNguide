const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const keys = require("../util/.keys.js");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Auth failed :(");
    }
    const decodedToken = jwt.verify(token, keys.jotTokenServerKey);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (e) {
    const error = new HttpError("Auth failed :(", 401);
    return next(error);
  }
};
