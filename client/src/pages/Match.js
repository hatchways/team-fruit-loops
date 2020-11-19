import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  Card, CardContent,
  Divider,
  Typography,
  Button,
} from '@material-ui/core';
import { AddCircle, Check, Cancel, Link, } from '@material-ui/icons';

const rolesStyles = theme => ({
  role: {
    textAlign: "center",
  },
});

const Roles = withStyles(rolesStyles)(({ classes, roles, update, self }) => {
  let disabled = false;
  const onClick = role => e => {
    e.preventDefault();
    if (!disabled) {
      update(role, self);
    }
  };
  const available = Object.entries(roles).filter(([, player]) => {
    if (self === player) {
      disabled = true;
    }
    return player === "";
  });

  return (
    <Grid container>
      {
          available.map(([role, ]) => (
            <Grid item xs={12} key={role} className={classes.role}>
              <Button endIcon={<AddCircle onClick={onClick(role)}/>}>
                { role }
              </Button>
            </Grid>
        ))
      }
    </Grid>
  );
});

const playerStyles = theme => ({
  role: {
    textAlign: "center",
  },
});

const Players = withStyles(playerStyles)(({ classes, roles, self, update }) => {
  const taken = Object.entries(roles).filter(([, v]) => v !== ""),
    onClick = (role, player) => e => {
      e.preventDefault();
      if (self !== player) {
        return
      }
      update(role, "");
    };

  return (
    <Grid container item justify="center" xs={12}>
      {
        taken.map(([role, player]) => (
          <Grid item xs={12} key={role} className={classes.role}>
            <Button
              key={role}
              startIcon={<Check style={{fill: "rgb(95, 184, 115)"}}/>}
              endIcon={
                self === player
                  ? <Cancel onClick={onClick(role, player)}/>
                  : null
              }>
              { `${player} - ${role}${self === player ? ' (You)' : '' }` }
            </Button>
          </Grid>
        ))
      }
    </Grid>
  );
});

const gameStyles = theme => ({
  container: {
    marginTop: theme.spacing(3)
  },
  header: {
    textAlign: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
  content: {
    paddingTop: theme.spacing(0),
  },
  hDivider: {
    height: "1px",
    backgroundColor: "rgb(72, 172, 122)",
    marginLeft: theme.spacing(35),
    marginRight: theme.spacing(35),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  vDivider: {
    width: "1px",
  },
  bold: {
  },
  player: {
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
    textAlign: "left",
  },
  copy: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
});

const Match = withStyles(gameStyles)(({ classes }) => {
  const [url, ] = useState("This is a Link"),
    [self, ] = useState("Bonnie"),
    [roles, setRoles] = useState({
      "Blue Spy Master": "",
      "Red Field Agent": "",
      "Blue Field Agent": "",
      "Red Spy Master": "Bonnie" ,
    });

  const update = (k, v) => setRoles({ ...roles, [k]: v });

  // Copy url to system clipboard by creating dummy html
  // element to write value into. added to document.body
  // for `document.execCommand("copy")` to read
  const copy = url => e => {
    e.preventDefault();
    if (document === undefined) {
      return ;
    }
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("value", url);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  const start = e => {
    e.preventDefault();
    console.log("start match");
  };

  return (
    <Container component="h1" className={classes.container}>
      <Card>
        {/* <CardHeader component="h4" className={classes.header} title=""/> */}
        <CardContent className={classes.content}>
          <Typography variant="h3" className={classes.header}>
            New Game
          </Typography>
          <Divider className={classes.hDivider} variant="middle"/>
          <Grid container spacing={1}>
            <Grid item container xs={12} justify="center">
              <Typography align="center" variant="h6">
                Available roles
              </Typography>
              <Roles self={self} update={update} roles={roles}/>
            </Grid>
            <Grid item container xs={12} align="center" direction="row">
              <Grid item xs={8}>
                <Typography variant="h5" className={classes.player}>
                  Players ready for match:
                </Typography>
                <Players update={update} roles={roles} self={self}/>
              </Grid>
              <Grid item xs={1}>
                <Divider orientation="vertical" className={classes.vDivider}/>
              </Grid>
              <Grid item align="center" xs={3}>
                <Typography variant="h5" className={classes.copy}>
                  Share match id:
                </Typography>
                <Button
                  onClick={copy(url)}
                  variant="outlined"
                  startIcon={<Link/>}>
                  Copy
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} align="center">
              <Button onClick={start} variant="outlined" >Start Match</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
});

export default Match;
