#!/usr/bin/env node

/* Sets up the environment variables from your .env file*/
// require("dotenv").config();

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

// 127.0.0.1:3001'
// http://localhost:3000

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

const server = require("http").createServer(app);

// Configure websockets
console.log(process.env.CORS_ORIGIN);
// const origin = "http://localhost:3000" || process.env.CORS_ORIGIN;
const socket = io(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  }
});

let connections = [];
connections.emit = function(message, body) {
  this.connections.forEach(s => s.emit(message, body));
}

socket.on("connection", socket => {
  console.log("Connected to new client");
  connections.push(socket);

  socket.on("disconnect", () => {
    const index = connections.indexOf(socket);
    connections.splice(index, 1)
    console.log("Client disconnected");
  });

  socket.on("ClientDate", date => console.log("Received message from client: ", date));

  // emit time to all connections on new connection
  setTimeout(() => {
    emitTime(connections);
  }, 1000);
});

const emitTime = connections => {
  const date = new Date();

  connections.forEach(s => s.emit("ServerDate", date));
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  console.log("Listening on " + bind);
}
