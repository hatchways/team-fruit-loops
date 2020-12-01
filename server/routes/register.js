const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User");

router.post("/", function (req, res, next) {
  let { name, email, password, confirmPassword } = req.body;

  // First check to make sure all fields are valid
  let errors = [];

  if (!name) {
    errors.push("Name required");
  }

  // Not doing email validation due to some discussion about regex being a bad idea
  // Can implement basic @ and . checking if expected/desired
  if (!email) {
    errors.push("Email required");
  }

  if (!password) {
    errors.push({ password: "required" });
  } else if (password.length < 6) {
    errors.push("Password minimum six characters required");
  }

  if (!confirmPassword) {
    errors.push("Confirm password required");
  }

  if (password != confirmPassword) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  // If all fields are valid, check database to see if email address is available
  User.findOne({ email: email })
    .then((user) => {
      // Email address already taken
      if (user) {
        return res.status(422).json({ errors: "Email address already in use" });
      } else {
        // Everything valid; create account
        const user = new User({
          name: name,
          email: email,
          password: password,
          imageUrl: "",
        });

        bcrypt.hash(password, 10).then((hash) => {
          // Replace plaintext password with hashed version
          user.password = hash;

          user
            .save()
            .then(() => {
              // Successfully created user
              res.sendStatus(201);
            })
            .catch((err) => {
              res.status(500).json({
                errors: err,
              });
            });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: err,
      });
    });
});

module.exports = router;
