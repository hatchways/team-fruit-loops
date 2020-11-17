const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.clearCookie("token");
  res.send({ success: true });
});

module.exports = router;
