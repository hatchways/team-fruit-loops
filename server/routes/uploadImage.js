const express = require("express");
const router = express.Router();

const upload = require("../services/uploadImage");

const User = require("../models/User");

router.post("/", (req, res) => {
  // ISSUE: Cannot read req values here, but can read them inside the Multer code block
  // EXPECTED RESULT: Check user exists in MongoDB database first, then run Multer

  upload.single("image")(req, res, (err) => {
    if (err) return res.status(422).json(err);
    User.findById(req.body.id).then((user) => {
      if (!user) return res.sendStatus(404);

      user.imageUrl = req.file.location;
      user.save();

      return res.status(200).json({ imageUrl: req.file.location });
    });
  });
});

module.exports = router;
