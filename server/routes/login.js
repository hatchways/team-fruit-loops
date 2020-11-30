const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../utils/auth");

const secret = process.env.ACCESS_TOKEN_SECRET;

if (secret === "") {
  console.log("Errror: expected ACCESS_TOKEN_SECRET env var");
}

const User = require("../models/User");

router.post("/", function (req, res, next) {
  let { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log(`User with email "${email}" doesn't exist`);
        // Avoid information leakage: don't disclose user existence
        return res.status(404).json({
          errors: "Invalid credentials",
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              console.log(`Invalid login attempted on user=${user.name}`);
              return res.status(400).json({ errors: "Invalid credentials" });
            }

            const payload = {
              id: user._id,
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
            };

            // Correct credentials have been provided; create JWT
            const access_token = createAccessToken(payload, "30m");

            jwt.verify(
              access_token,
              secret,
              (err, decoded) => {
                if (err) {
                  console.log(`Error verifying JWT user=${user.name}`);
                  res.status(403).json({ errors: err });
                }
                if (decoded) {
                  // Save the JWT token in a cookie
                  res.cookie("token", access_token, {
                    httpOnly: true,
                    sameSite: "strict",
                  });

                  console.log(`Logged in user=${user.name}`);
                  return res.status(200).json({
                    token: access_token,
                    user: user,
                  });
                }
              }
            );
          })
          .catch((err) => {
            console.log(`Error logging in user=${user.name}`);
            res.status(500).json({ errors: err });
          });
      }
    })
    .catch((err) => {
      console.log(`Error finding user with email=${email}`);
      res.status(500).json({ errors: err });
    });
});

module.exports = router;
