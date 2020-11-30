const express = require("express");
const router = express.Router();

const authenticate = require("../controllers/authenticate");

// Check to see if a user is logged in and authenticated
// This route only returns cookie info
router.get("/", authenticate.token, (req, res) => {
  let user = req.user;

  if (user) {
    res.status(200).json(user);
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
