// Get account information from MongoDB

const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../controllers/auth");

const User = require("../models/User");

router.get("/", authenticateToken, (req, res) => {
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

module.exports = router;
