import React from "react";
import {
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import { AddCircle, } from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';

// map backend state -> frontend text
const lookup = {
  "red spy": "Red Spy Master",
  "blue spy": "Blue Spy Master",
  "red guesser": "Red Field Agent",
  "blue guesser": "Blue Field Agent",
};

const roleStyles = {
  role: {
    textAlign: "center",
  }
};

const Role = withStyles(roleStyles)(({ classes, onAssign, selected, role }) => {
  const click = role => e => {
    e.preventDefault();
    if (!selected) {
      onAssign(role);
    }
  };

  return (
    <Grid item xs={12} key={role} className={classes.role}>
      <Button endIcon={<AddCircle onClick={click(role)}/>}>
        <Typography align="center">{ lookup[role] }</Typography>
      </Button>
    </Grid>
  );
});

const LobbyRoles = ({ onAssign, off, state: {gameState: { redSpy, blueSpy, }} }) => (
  <Grid container item justify="center">
    {
      blueSpy === undefined && <Role role="blue spy" onAssign={onAssign} disabled={off} />
    }
    {
      redSpy === undefined && <Role role="red spy" onAssign={onAssign} disabled={off} />
    }
    <Role role="blue guesser" onAssign={onAssign} disabled={off} />
    <Role role="red guesser" onAssign={onAssign} disabled={off} />
  </Grid>
);

export default LobbyRoles;
