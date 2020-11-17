const jwt = require("jsonwebtoken");

exports.createAccessToken = (payload, duration) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: duration,
  });
};

exports.createRefreshToken = (email, userId) => {
  const payload = {
    email,
    userId,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
};
