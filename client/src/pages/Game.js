import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Container,
  Toolbar,
} from "@material-ui/core";
import PropTypes from 'prop-types';

import Finished from "../components/Game/Finished"
import GameCard from "../components/Game/Board"
import GameSidebar, { sidebarWidth } from "../components/Sidebar"

const styles = theme => ({
  board: {
    marginLeft: sidebarWidth,
    marginTop: theme.spacing(3),
  },
  row: {
    width: "100%",
    padding: theme.spacing(0),
    margin: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
});

const isSpy = ({player, gameState: {redSpy, blueSpy}}) => (
  player === redSpy || player === blueSpy
);

const GamePage = ({ classes, state, socket, gameID, ...props }) => {
  const [winner, ] = useState("blue"),
    [finished, ] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Joining game: ", gameID);
    }
    socket.emit("join", gameID);
  }, [socket, gameID]);

  return (
    <Container>
      <Finished
        finished={finished}
        winner={winner}
        bluePoints={state.gameState.bluePoints}
        redPoints={state.gameState.redPoints}/>
      <GameSidebar
        gameID={gameID}
        state={state}
        socket={socket}
        player={state.player}
        count={4}
        countMax={5}
        token="Animals"
        isSpy={isSpy(state)}/>
      <Grid item container xs={9}
        align="center"
        direction="column"
        className={classes.board}
        justify="space-between">
        <Toolbar/>
        {[...Array(6).keys()].map(i => (
          <Grid item container xs={12}
            key={`${i}`}
            direction="row" className={classes.row}>
            { [...Array(6).keys()].map(k => <GameCard key={`${i}${k}`}/>) }
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

GamePage.propTypes = {
  classes: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  gameID: PropTypes.string.isRequired,
};

const Game = withStyles(styles)(GamePage);

export default Game;
