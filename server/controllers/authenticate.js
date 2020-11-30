const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secret = process.env.ACCESS_TOKEN_SECRET;

if (secret === "") {
  console.log("Errror: expected ACCESS_TOKEN_SECRET env var");
}

const token = (req, res, next) => {
  const tok = req.cookies["token"];

  if (tok == null) return res.sendStatus(401);

  jwt.verify(tok, secret, (err, user) => {
    if (err) {
      res.clearCookie("token");

      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

const player = (req, res, next) => {
  const id = req.params.player;
  req.id = id;
  const validatePlayerCallback = (err, user) => {
    if (err) {
      console.log(err);
      res.status(400).send({ error: `Error fetching ${user}`});
      return ;
    }
    next();
  };

  User.findOne({ name: id }, validatePlayerCallback);
};

module.exports = {
  token,
  player,
};
