import React, { useState, useEffect, useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
}));

const Test = (props) => {
  const classes = useStyles();

  const testPlayers = ["Player 1", "Player 2", "Player 3", "Player 4"];

  const [gameId, setGameId] = useState("");
  const [gameState, setGameState] = useState(null);

  // Player that is making a move
  const [player, setPlayer] = useState(testPlayers[0]);
  // Player's role in the game
  const [playerRole, setPlayerRole] = useState("Red Spy");
  // Spy's provided word hint
  const [spyHint, setSpyHint] = useState("");
  // Spy's provided number of guesses given hint
  const [spyGuesses, setSpyGuesses] = useState(1);

  useLayoutEffect(() => {
    let id = "";

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
    console.log("join emit function");
    props.socket.emit("join", "demo-id");
  }, []);

  useEffect(() => {
    props.socket.on("guesserNextMove", (payload, err) => {
      if (!err) {
        setGameState(payload);
      } else {
        console.log(err);
      }
    });

    props.socket.on("spyNextMove", (payload, err) => {
      if (!err) {
        setGameState(payload);
      } else {
        console.log(err);
      }
    });

    props.socket.on("endTurn", (payload) => {
      setGameState(payload);
    });

    props.socket.on("restartGame", (payload) => {
      setGameState(payload);
    });
  }, [props.socket]); //only re-run the effect if new message comes in

  const handleGuesserTurn = (e, word) => {
    props.socket.emit("guesserNextMove", "demo-id", player, word);
  };

  // Custom functions
  const handlePlayerChange = (e) => {
    setPlayer(e.target.value);
    getPlayerRole(e.target.value);
  };

  const getPlayerRole = (player) => {
    let role = "";

    if (player === gameState["redSpy"]) {
      role = "Red Spy";
    } else if (player === gameState["blueSpy"]) {
      role = "Blue Spy";
    } else if (gameState["redGuessers"].includes(player)) {
      role = "Red Guesser";
    } else if (gameState["blueGuessers"].includes(player)) {
      role = "Blue Guesser";
    } else {
    }

    setPlayerRole(role);
  };

  const handleSpyHintChange = (e) => {
    setSpyHint(e.target.value);
  };

  const handleSpyGuessesChange = (e) => {
    setSpyGuesses(e.target.value);
  };

  // const handleHintSubmit = (e) => {
  //   axios
  //     .put(`/game/${gameId}/next-move`, {
  //       player: player,
  //       hint: {
  //         word: spyHint,
  //         times: spyGuesses,
  //       },
  //       word: "word",
  //     })
  //     .then((res) => {})
  //     .catch((err) => {
  //       console.log(err.response.data.error);
  //     });
  // };

  return (
    <>
      {" "}
      {gameState ? (
        <>
          <Typography>Game ID: {gameId}</Typography>
          <Typography>Current Turn: {gameState.turn}</Typography>
          <Typography>Red Points: {gameState.redPoints}</Typography>
          <Typography>Blue Points: {gameState.bluePoints}</Typography>
          <Typography>Game Ended: {gameState.isEnd}</Typography>
          <Typography>
            Spy Hint: {gameState.hint !== undefined ? gameState.hint : "N/A"}
          </Typography>
          <Typography>Number of Guesses: {gameState.guessNum}</Typography>
          <Typography>Cards:</Typography>
          {gameState.cards ? (
            Object.entries(gameState.cards).map(([k, v]) => (
              <Button
                key={k}
                variant="contained"
                disabled={gameState.boardState[k].status !== "covered"}
                style={{ color: v }}
                onClick={(e) => {
                  handleGuesserTurn(e, k);
                }}
              >
                {k}
              </Button>
            ))
          ) : (
            <></>
          )}
          <br />

          <div>
            <FormControl className={classes.textField}>
              <InputLabel id="player-label" className={classes.textField}>
                Player
              </InputLabel>
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
            </FormControl>

            <FormControl className={classes.textField}>
              <TextField
                label="Player Role"
                value={playerRole}
                InputProps={{ readOnly: true }}
              />
            </FormControl>

            <FormControl className={classes.textField}>
              <TextField
                label="Hint"
                value={spyHint}
                disabled={playerRole.toLocaleLowerCase().includes("guesser")}
                onChange={handleSpyHintChange}
              />
            </FormControl>

            <FormControl className={classes.textField}>
              <TextField
                label="# of Guesses"
                value={spyGuesses}
                disabled={playerRole.toLocaleLowerCase().includes("guesser")}
                onChange={handleSpyGuessesChange}
              />
            </FormControl>
{/* 
            <Button variant="contained" onClick={handleHintSubmit}>
              Submit Hint
            </Button> */}

            {/* Socket Buttons */}
            <Button
              variant="contained"
              onClick={() => {
                props.socket.emit(
                  "spyNextMove",
                  "demo-id",
                  player,
                  spyHint,
                  spyGuesses
                );
              }}
            >
              Spymaster Move
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                props.socket.emit("endTurn", "demo-id");
              }}
            >
              End Turn
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                props.socket.emit("restartGame", "demo-id");
              }}
            >
              Restart
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Test;
