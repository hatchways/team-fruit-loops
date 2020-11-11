// Test page for account validation

const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../controllers/auth");

router.get("/", authenticateToken, function (req, res) {
  res.sendStatus(200);
});

module.exports = router;
