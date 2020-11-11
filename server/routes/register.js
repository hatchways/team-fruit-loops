const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User");

router.post("/", function (req, res, next) {
  let { name, email, password, confirm_password } = req.body;

  // First check to make sure all fields are valid
  let errors = [];

  if (!name) {
    errors.push({ name: "required" });
  }

  // Not doing email validation due to some discussion about regex being a bad idea
  // Can implement basic @ and . checking if expected/desired
  if (!email) {
    errors.push({ email: "required" });
  }

  if (!password) {
    errors.push({ password: "required" });
  } else if (password.length < 6) {
    errors.push({ password: "minimum six characters" });
  }

  if (!confirm_password) {
    errors.push({
      confirm_password: "required",
    });
  }

  if (password != confirm_password) {
    errors.push({ password: "mismatch" });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  // If all fields are valid, check database to see if email address is available
  User.findOne({ email: email })
    .then((user) => {
      // Email address already taken
      if (user) {
        return res
          .status(422)
          .json({ errors: [{ user: "Email address already in use" }] });
      } else {
        // Everything valid; create account
        const user = new User({
          name: name,
          email: email,
          password: password,
        });

        bcrypt.hash(password, 10).then((hash) => {
          // Replace plaintext password with hashed version
          user.password = hash;

          user
            .save()
            .then((response) => {
              res.status(201).json({ success: [{ response: response }] });
            })
            .catch((err) => {
              res.status(500).json({
                errors: [{ error: err }],
              });
            });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ error: err }],
      });
    });
});

module.exports = router;
