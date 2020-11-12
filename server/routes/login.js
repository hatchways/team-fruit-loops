const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../utils/auth");

const User = require("../models/User");

router.post("/", function (req, res, next) {
  let { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // For security purposes, do not reveal in login that a user does not
        // exist in the database
        return res.status(404).json({
          errors: "Invalid credentials",
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(400).json({ errors: "Invalid credentials" });
            }

            // Correct credentials have been provided; create JWT
            const access_token = createAccessToken(user.email, user._id, "15s");

            jwt.verify(
              access_token,
              process.env.ACCESS_TOKEN_SECRET,
              (err, decoded) => {
                if (err) {
                  res.status(403).json({ errors: err });
                }
                if (decoded) {
                  // Save the JWT token in a cookie
                  res.cookie("token", access_token, { httpOnly: true });

                  return res.status(200).json({
                    token: access_token,
                    user: user,
                  });
                }
              }
            );
          })
          .catch((err) => {
            res.status(500).json({ errors: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ errors: err });
    });
});

module.exports = router;
