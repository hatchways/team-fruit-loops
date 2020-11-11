import React from "react";

import { AppBar, Toolbar, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    backgroundColor: "white",
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Typography variant="h1">CLUEWORDS</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
