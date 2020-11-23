import React from "react";

import { AppBar, Toolbar, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import NavbarProfileComponent from "./NavbarProfileComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  navbar: {
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.navbar}>
        <Toolbar>
          <Typography variant="h1" className={classes.title}>
            CLUEWORDS
          </Typography>

          {/* TODO: Properly create/position these elements */}
          {/*   - CLUEWORDS title is centered, except in-game where it is placed on the left */}
          {/*   - Scoreboard component is placed in the center only when on the game page */}
          {/*   - New Game button is placed on the right (left of profile component) only when on the game page */}
          {/*   - Profile component is placed on the right and is visible only when a user is logged in */}
          <NavbarProfileComponent />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
