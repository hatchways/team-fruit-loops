const jwt = require("jsonwebtoken");

const secret = process.env.ACCESS_TOKEN_SECRET;

if (secret === "") {
  console.log("Errror: expected ACCESS_TOKEN_SECRET env var");
}

exports.createAccessToken = (payload, duration) => {
  return jwt.sign(payload, secret, {
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
