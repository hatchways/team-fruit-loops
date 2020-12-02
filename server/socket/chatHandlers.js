const gameController = require('../controllers/game');

// Propagate players chats & chat notifications to all in gameID
const chat = io => (gameID, type, text, author) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Received ${type} in game ${gameID} from ${author}: ${text}`);
  }
  io.to(gameID).emit("chat", type, text, author);
};

module.exports = {
  chat,
}
