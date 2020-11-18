import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import {
  Container,
  Grid,
  Card, CardContent,
  Divider,
  Typography,
  Button,
  Dialog, DialogTitle, DialogContent,
  IconButton,
} from '@material-ui/core';
import { Close, AddCircle, Check, Cancel, Link, } from '@material-ui/icons';

// map backend state -> frontend text
const lookup = {
  "red spy": "Red Spy Master",
  "blue spy": "Blue Spy Master",
  "red guesser": "Red Field Agent",
  "blue guesser": "Blue Field Agent",
};

const api = {
  "assign": {
    url: id => `/game/${id}/assign`,
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: (player, role) => JSON.stringify({ player, role }),
  },
  "start": {
    url: id => `/game/${id}/start`,
    method: "PUT",
    headers: {
      Accept: "application/json",
    },
    body: () => "",
  },
  "remove": {
    url: id => `/game/${id}/unassign`,
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: (player, role) => JSON.stringify({ player, role }),
  }
};

// copy url to system clipboard by creating dummy html element to write value
// into. added to document.body for `document.execCommand("copy")` to read
const copy = id => e => {
  e.preventDefault();
  const dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute("value", id);
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
};

const roleStyles = {
  role: {
    textAlign: "center",
  }
}

const Role = withStyles(roleStyles)(({ classes, call, selected, role }) => {
  const click = role => e => {
    e.preventDefault();
    if (!selected) {
      call("assign", role);
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

const Player = ({ click, player, self, role }) => (
  <Grid item xs={12} key={player}>
    <Button
      key={player}
      startIcon={<Check style={{fill: "rgb(95, 184, 115)"}}/>}
      endIcon={self && <Cancel onClick={click(player, role)}/>}>
      <Typography align="center">
        { `${player} - ${lookup[role]}${self ? ' (You)' : '' }` }
      </Typography>
    </Button>
  </Grid>
);

const Players = ({ state, call, }) => {
  const { blueSpy, redSpy, blueGuessers, redGuessers, } = state.gameState,
    click = (user, role) => e => {
      e.preventDefault();
      if (state.player === user) {
        return ;
      }
      call("remove", role);
    };

  return (
    <Grid container item xs={12}>
      {
        blueSpy !== undefined &&
          <Player role={"blue spy"} player={blueSpy} click={click} />
      }
      {
        redSpy !== undefined &&
          <Player role={"red spy"} player={redSpy} click={click} />
      }
      {
        redGuessers.map(player => (
          <Player role={"red guesser"} player={player} click={click} />
        ))
      }
      {
        blueGuessers.map(player => (
          <Player role={"red guesser"} player={player} click={click} />
        ))
      }
    </Grid>
  );
};

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
  close: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  }
});

// isOff checks if player has already selected a role
const isOff = ({ blueSpy, redSpy, redGuessers, blueGuessers }, player) => (
  blueSpy === player || blueGuessers.includes(player)
  || redSpy === player || redGuessers.includes(player)
);

const invalidState = s => (
  s === undefined || !s.hasOwnProperty("id") || !s.hasOwnProperty("gameState")
);

const useForceUpdate = () => {
  const [updateView, setUpdateView] = useState(0);

  return () => setUpdateView(updateView + 1);
};

const Lobby = withStyles(gameStyles)(({ classes, state, setState }) => {
  if (invalidState(state)) {
    return <Redirect to="/match" />;
  }

  const { gameState } = state,
    forceUpdate = useForceUpdate(),
    [err, setErr] = useState(false),
    off = isOff(gameState, state.player),
    call = async (type, role) => {
      const res = await fetch(api[type].url(state.id), {
        method: api[type].method,
        headers: api[type].headers,
        body: api[type].body(state.player, role),
      });

      if (res.status >= 200 && res.status < 300) {
        const next = await res.json();
        setState(Object.assign(state, next));
        forceUpdate();
      } else {
        setErr(true);
      }
    };

  return (
    <Container component="h1" className={classes.container}>
      <Dialog open={err} onClose={() => setErr(false)}>
        <DialogTitle>
          <Typography align="center">Error</Typography>
          <IconButton
            className={classes.close}
            onClick={() => setErr(false)}>
            <Close/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography align="center" component="h2">
            Error in game, please try again later
          </Typography>
        </DialogContent>
      </Dialog>
      <Card>
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
              <Grid container item justify="center" direction="column">
                {
                  (!gameState.hasOwnProperty("blueSpy")
                    || gameState.blueSpy === "")
                    && <Role role="blue spy" call={call} disabled={off} />
                }
                {
                  (!gameState.hasOwnProperty("redSpy")
                   || gameState.redSpy === "")
                    && <Role role="red spy" call={call} disabled={off} />
                }
                <Role role="blue guesser" call={call} disabled={off} />
                <Role role="red guesser" call={call} disabled={off} />
              </Grid>
            </Grid>
            <Grid item container xs={12} align="center" direction="row">
              <Grid item xs={8}>
                <Typography variant="h5" className={classes.player}>
                  Players ready for match:
                </Typography>
                <Players call={call} state={state}/>
              </Grid>
              <Grid item xs={1}>
                <Divider orientation="vertical" className={classes.vDivider}/>
              </Grid>
              <Grid item align="center" xs={3}>
                <Typography variant="h5" className={classes.copy}>
                  Share match id:
                </Typography>
                <Button
                  onClick={copy(state.id)}
                  variant="outlined"
                  startIcon={<Link/>}>
                  Copy
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} align="center">
              <Button onClick={() => call("start", "")} variant="outlined">
                Start Match
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
});

export default Lobby;
