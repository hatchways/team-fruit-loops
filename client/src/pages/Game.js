import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Container,
  Toolbar,
} from "@material-ui/core";

import GameCard from "../components/GameCard"
import GameSidebar, { sidebarWidth } from "../components/GameSidebar"

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

const Game = withStyles(styles)(({ classes, state/*, setState, gameID, setGameID, socket*/}) => {
  // const isSpy = state &&
  //   (state.player === state.redSpy || state.player === state.blueSpy);
  const isSpy = true;

  return (
    <Container>
      <GameSidebar isSpy={isSpy} />
      <Grid item container
        xs={9}
        align="center"
        direction="column"
        className={classes.board}
        justify="space-between">
        <Toolbar/>
        {[...Array(6).keys()].map(i => (
          <Grid item container
            key={`${i}`}
            xs={12}
            direction="row"
            className={classes.row}>
            { [...Array(6).keys()].map(k => <GameCard key={`${i}${k}`}/>) }
          </Grid>
        ))}
      </Grid>
    </Container>
  );
});

export default Game;
