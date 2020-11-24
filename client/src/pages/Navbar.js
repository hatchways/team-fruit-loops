import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
} from "@material-ui/core";

import GameNavbar from "../components/Game/Nav";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    zIndex: 1300,
    backgroundColor: "white",
    height: "10vh"
  },
}));

const Navbar = ({ location, state }) => {
  const classes = useStyles();

  if (location.pathname === "/game") {
    return <GameNavbar state={state} classes={classes} />;
  };

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Typography variant="h1">CLUEWORDS</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);