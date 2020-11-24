const handleChatEvent = socket => (gameID, type, author, text) => {
  console.log(`Received ${type} in game ${gameID}: ${author} - ${text}`);
  // socket.to(gameID).emit('chat', type, author, text);
  // emit to sender as well
  socket.in(gameID).emit("chat", type, "tom", text);
};

module.exports = {
  handleChatEvent,
}
