const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require('mongoose');
const io = require("socket.io");

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");

const { json, urlencoded } = express;

const mongoURL = process.env.MONGODB_URL || "";
const app = express();

// Configure MongoDB connectivity
mongoose.connect(mongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
})
.catch(error => {
  console.log(`Error connecting to MongoDB: ${error}`);
  process.exit(1);
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Configure Express Server
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/ping", pingRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

// Configure websockets
const server = require("http").createServer(app);
const socket = io(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  }
});

let connections = [];
connections.emit = function(message, body) {
  this.connections.forEach(s => s.emit(message, body));
}

socket.on("connection", socket => {
  console.log("Connected to new client: ", socket);
  connections.push(socket);
  socket.on("disconnect", () => {
    const index = connections.index(socket);
    console.log("Client disconnected", connections.splice(index, 1));
  });
  // emit time to all connections on new connection
  setTimeout(() => {
    emitTime(connections);
  }, 1000);
});

const emitTime = connections => {
  const date = new Date();

  connections.forEach(s => {
    console.log("sending date to socket: ", socket);
    s.emit("Date", date);
  });
}

module.exports = app;
