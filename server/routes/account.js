// Get account information from MongoDB

const express = require("express");
const router = express.Router();

const authenticate = require("../controllers/authenticate");

const User = require("../models/User");

router.get("/", authenticate.token, (req, res) => {
  let user = req.user;

  if (user) {
    User.findById(user.id)
      .then((user) => {
        return res.status(200).json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.sendStatus(403);
  }
});

// Update account
// Currently only works for name changes
router.post("/update", (req, res) => {
  User.findById(req.body.id).then((user) => {
    if (!user) return res.sendStatus(404);

    user.name = req.body.name;
    user.save();

    return res.sendStatus(200);
  });
});

module.exports = router;
