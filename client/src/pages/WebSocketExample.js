import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Endpoint = process.env.WS_URL || "http://127.0.0.1:3001";

const WebSocketExample = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const socket = socketIOClient(Endpoint);
    console.log("Connected to web socket endpoint: ", Endpoint);
    socket.on("ServerDate", data => setDate(data));
    socket.emit("ClientDate", new Date());
    //disconnect from socket when component dismounts
    return () => {
      console.log("Disconnected from web socket");
      socket.disconnect();
    };
  }, []);

  return (
    <div>{ date === "" ? "not connected" : date }</div>
  );
}

export default WebSocketExample;
