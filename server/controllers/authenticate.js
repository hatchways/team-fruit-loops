const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

if (jwtSecret === "") {
  console.log("Errror: expected ACCESS_TOKEN_SECRET env var");
}

const token = (req, res, next) => {
  const tok = req.cookies["token"];

  if (tok == null) return res.sendStatus(401);

  jwt.verify(tok, jwtSecret, (err, user) => {
    if (err) {
      res.clearCookie("token");

      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

const player = async (req, res, next) => {
  let user = null;
  const name = req.params.player;

  try {
    user = await User.findOne({ name });
  } catch(err) {
    console.log(`Error retrieving user: ${err.message}`);
  }
  if (user === null) {
      return res.status(500).send({ error: `Error fetching user`});
  }
  res.locals.user = user;
  next();
};

const playerHasPrivateGames = async (name) => {
  try {
    const user = await User.findOne({ name });
    return user?.account.privateGames.enabled;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

module.exports = {
  token,
  player,
  playerHasPrivateGames,
};
