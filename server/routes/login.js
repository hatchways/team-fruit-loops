const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createJWT } = require("../utils/auth");

const User = require("../models/User");

router.post("/", function (req, res, next) {
  let { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: [{ user: "User not found" }],
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res
                .status(400)
                .json({ errors: [{ password: "Incorrect password" }] });
            }

            let access_token = createJWT(user.email, user._id, 3600);

            jwt.verify(
              access_token,
              process.env.TOKEN_SECRET,
              (err, decoded) => {
                if (err) {
                  res.status(500).json({ errors: err });
                }
                if (decoded) {
                  return res.status(200).json({
                    success: true,
                    token: access_token,
                    message: user,
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
