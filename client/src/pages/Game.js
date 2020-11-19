import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Paper,
} from "@material-ui/core";

const SidebarTop = () => {
  return (
    <div></div>
  );
};

const SidebarMiddle = () => {
  return (
    <div></div>
  );
};

const SidebarBottom = () => {
  return (
    <div></div>
  );
};

const sidebarStyles = theme => ({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "blue",
    height: "100%",
  },
});

const Sidebar = withStyles(sidebarStyles)(({ classes }) => {
  return (
    <Grid item container xs={3} className={classes.sidebar}>
      <SidebarTop/>
      <SidebarMiddle/>
      <SidebarBottom/>
    </Grid>
  );
});

const cardStyles = theme => ({
  board: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "red",
    height: "100%",
  },
  row: {
    width: "100%",
  },
  card: {
    marginLeft: theme.spacing(1),
    height: "100%",
    textAlign: "center",
  },
  paper: {
    height: "75%",
    paddingTop: "35%",
  },
});

const Cards = withStyles(cardStyles)(({ classes }) => {
  return (
    <Grid item container xs={9} className={classes.board}>
      {[...Array(6).keys()].map(i => (
        <Grid item container
          key={`${i}`}
          xs={12}
          spacing={1}
          className={classes.row}>
          {[...Array(6).keys()].map(k => (
            <Grid item xs key={`${i}${k}`} className={classes.card}>
              <Paper className={classes.paper}>{`${i}${k}`}</Paper>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
});

const styles = theme => ({
});

const Game = withStyles(styles)(({ classes }) => {
  return (
    <Container>
      <Grid container align="stretch" xs={12}>
        <Sidebar/>
        <Cards/>
      </Grid>
    </Container>
  );
});

export default Game;
