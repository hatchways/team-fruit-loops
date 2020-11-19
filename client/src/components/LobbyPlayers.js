import React from "react";
import {
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import { Check, Cancel, } from "@material-ui/icons";

// map backend state -> frontend text
const lookup = {
  "red spy": "Red Spy Master",
  "blue spy": "Blue Spy Master",
  "red guesser": "Red Field Agent",
  "blue guesser": "Blue Field Agent",
};

const isSelf = ({
  player,
  gameState: {
    blueSpy,
    redSpy,
    redGuessers,
    blueGuessers
  }}, role) => {
  switch (role) {
    case "red spy":
      return redSpy === player;
    case "blue spy":
      return blueSpy === player;
    case "red guesser":
      return redGuessers !== undefined && redGuessers.includes(player);
    case "blue guesser":
      return blueGuessers !== undefined && blueGuessers.includes(player);
    default:
      if (process.env.NODE_ENV === "development") {
        console.log(`Error - unknown case: ${role}`);
      }
      return false;
  };
};

const Player = ({ click, player, self, role }) => (
  <Grid item xs={12} key={player}>
    <Button
      key={player}
      startIcon={<Check style={{fill: "rgb(95, 184, 115)"}}/>}
      endIcon={self && <Cancel onClick={click(role)}/>}>
      <Typography align="center">
        { `${player} - ${lookup[role]}${self ? ' (You)' : '' }` }
      </Typography>
    </Button>
  </Grid>
);

const LobbyPlayers = ({ state, call, }) => {
  const { blueSpy, redSpy, blueGuessers, redGuessers, } = state.gameState,
    click = role => e => {
      e.preventDefault();
      call("remove", role);
    };

  return (
    <Grid container item xs={12}>
      {
        blueSpy !== undefined &&
          <Player
            self={isSelf(state, "blue spy")}
            role={"blue spy"}
            player={blueSpy}
            click={click} />
      }
      {
        redSpy !== undefined &&
          <Player
            self={isSelf(state, "red spy")}
            role={"red spy"}
            player={redSpy}
            click={click} />
      }
      {
        redGuessers.map(player => (
          <Player
            self={isSelf(state, "red guesser")}
            role={"red guesser"}
            key={player}
            player={player}
            click={click} />
        ))
      }
      {
        blueGuessers.map(player => (
          <Player
            self={isSelf(state, "red guesser")}
            role={"red guesser"}
            key={player}
            player={player}
            click={click} />
        ))
      }
    </Grid>
  );
};

export default LobbyPlayers;
