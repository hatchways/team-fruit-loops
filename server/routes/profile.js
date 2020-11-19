// Check to see if a user is logged in and authenticated
// This route only returns cookie info

const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../controllers/auth");

router.get("/", authenticateToken, (req, res) => {
  let user = req.user;

  if (user) {
    res.status(200).json(user);
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
