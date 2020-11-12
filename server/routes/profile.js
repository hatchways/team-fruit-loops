// Test page for account validation

const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../controllers/auth");

router.get("/", authenticateToken, (req, res) => {
  let user = req.user;

  if (user) {
    console.log(user);

    res.status(200).json(user);
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
