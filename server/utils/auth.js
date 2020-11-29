const jwt = require("jsonwebtoken");

exports.createAccessToken = (payload, duration) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: duration,
  });
};