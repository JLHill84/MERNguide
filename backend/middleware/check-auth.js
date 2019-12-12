const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Auth failed :(");
    }
    const decodedToken = jwt.verify(token, process.env.JOT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (e) {
    const error = new HttpError("Auth failed :(", 401);
    return next(error);
  }
};
