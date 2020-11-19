import React, { useState, useEffect } from "react";
import { Button, Typography } from "@material-ui/core";
import socketIOClient from "socket.io-client";

const Endpoint = process.env.WS_URL || "http://127.0.0.1:3001";
const axios = require("axios");

const Test = () => {
  const testPlayers = ["Player 1", "Player 2", "Player 3", "Player 4"];

  const [gameId, setGameId] = useState("");
  const [gameState, setGameState] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  let id = "";

  useEffect(() => {
    // Use this code block if server was just created or restarted to create a game instance

    axios
      .get("/game/demo-id/ping")
      .then((res) => {
        setGameId("demo-id");
        setGameState(res.data.gameState);
      })
      .catch((err) => {
        axios
          .post("/game/demo", { player: testPlayers[0] })
          .then((res) => {
            setGameId(res.data.id);
            id = res.data.id;

            axios
              .put(`/game/${id}/join`, { player: testPlayers[1] })
              .then((res) => {
                axios
                  .put(`/game/${id}/join`, { player: testPlayers[2] })
                  .then((res) => {
                    axios
                      .put(`/game/${id}/join`, { player: testPlayers[3] })
                      .then((res) => {
                        axios
                          .put(`/game/${id}/assign`, {
                            player: testPlayers[0],
                            role: "red spy",
                          })
                          .then((res) => {
                            axios
                              .put(`/game/${id}/assign`, {
                                player: testPlayers[1],
                                role: "red guesser",
                              })
                              .then((res) => {
                                axios
                                  .put(`/game/${id}/assign`, {
                                    player: testPlayers[2],
                                    role: "blue spy",
                                  })
                                  .then((res) => {
                                    axios
                                      .put(`/game/${id}/assign`, {
                                        player: testPlayers[3],
                                        role: "blue guesser",
                                      })
                                      .then((res) => {
                                        axios
                                          .put(`/game/${id}/start`, {})
                                          .then((res) => {
                                            setGameState(res.data.gameState);
                                          })
                                          .catch((err) => {
                                            console.log(err);
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          })
          .catch((err) => {});
      });

    // // Use this if you already have an active game session (server not restarted)
    // axios.get(`/game/${id}/ping`, {}).then((res) => {
    //   setGameId(res.data.id);
    //   setGameState(JSON.stringify(res.data));
    // });

    // Create client-side socket instance
    const sock = socketIOClient(Endpoint);
    // Save to state
    setSocket(sock);

    // Emit to join channel, passing id parameter
    sock.emit("join", id);

    // Instantiate listener tied to chat channel
    sock.on("chat", (user, message) => {
      setMessage(message + "E");
    });

    return () => {
      console.log(`Disconnected from web socket: ${sock.id}`);
      sock.disconnect();
    };
  }, []);

  const handleGuesserTurn = (e) => {
    console.log("Button pressed: " + e);
  };

  return (
    <>
      <Typography>Game ID: {gameId}</Typography>
      <Typography>
        Cards:{" "}
        {gameState
          ? Object.entries(gameState.cards).map(([k, v]) => (
              <Button
                key={k}
                variant="outlined"
                style={{ color: v, backgroundColor: "#999" }}
                onClick={handleGuesserTurn}
              >
                {k}
              </Button>
            ))
          : ""}
      </Typography>
    </>
  );
};

export default Test;
