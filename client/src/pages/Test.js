import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@material-ui/core";

import axios from "axios";

const Test = (props) => {
  const testPlayers = ["Player 1", "Player 2", "Player 3", "Player 4"];

  const [gameId, setGameId] = useState("");
  const [gameState, setGameState] = useState(null);

  const [player, setPlayer] = useState(testPlayers[0]);
  const [playerRole, setPlayerRole] = useState("");

  let id = "";

  useLayoutEffect(() => {
    console.log("Entering axios chain...");

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
  }, []);

  useEffect(() => {
    const updateHandler = () => {
      console.log("update recieved: ");
    };
    props.socket.emit("join", "demo-id");

    props.socket.on("update", updateHandler);
  }, [props.socket]);

  const handleGuesserTurn = (e, word) => {
    console.log("Button pressed: " + word);
    axios
      .put(`/game/${gameId}/next-move`, {
        player: testPlayers[2],
        hint: "",
        word: "word",
      })
      .then(() => {})
      .catch((err) => console.log(err));
  };

  // Custom functions
  const handlePlayerChange = (e) => {
    setPlayer(e.target.value);
  };

  return (
    <>
      {" "}
      {gameState ? (
        <>
          <Typography>Game ID: {gameId}</Typography>
          <Typography>Current Turn: {gameState.turn}</Typography>
          <Typography>Red Points: {gameState.redPoints}</Typography>
          <Typography>Blue Points: {gameState.redPoints}</Typography>
          <Typography>Game Ended: {gameState.isEnd}</Typography>
          <Typography>Cards:</Typography>
          {Object.entries(gameState.cards).map(([k, v]) => (
            <Button
              key={k}
              variant="outlined"
              style={{ color: v, backgroundColor: "#999" }}
              onClick={(e) => {
                handleGuesserTurn(e, k);
              }}
            >
              {k}
            </Button>
          ))}
          <br />
          <FormControl>
            <InputLabel id="player-label">Player</InputLabel>
            <Select
              labelId="player-label"
              id="player"
              value={player}
              onChange={handlePlayerChange}
            >
              {testPlayers.map((player) => (
                <MenuItem key={player} value={player}>
                  {player}
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="role">Player's Role</InputLabel>
            <TextField onChange={handleRoleChange}></TextField>
          </FormControl>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Test;
