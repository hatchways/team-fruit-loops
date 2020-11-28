import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { useParams } from 'react-router';
import {
  Container,
  Grid,
  Card, CardContent,
  Divider,
  Typography,
  Button,
  Dialog, DialogTitle, DialogContent,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { Close, Link, } from "@material-ui/icons";

import LobbyPlayers from "../components/Lobby/Players";
import LobbyRoles from "../components/Lobby/Roles";

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

const Lobby = withStyles(gameStyles)(({ classes, state, setState, socket }) => {
  const { gameID } = useParams();
  const {gameState, player} = state;
  if (gameID === undefined || gameState === undefined) {
    return (<Redirect to="/match" />);
  }

  const [err, setErr] = useState(undefined);
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [tooltipTimeout, setTooltipTimeout] = useState(undefined)

  const off = isOff(gameState, player);
  const isHost = player === gameState.playerList[0];

  const call = async (type, role) => {
    const res = await fetch(api[type].url(gameID), {
      method: api[type].method,
      headers: api[type].headers,
      body: api[type].body(state.player, role),
    });

    if (res.status < 200 || res.status >= 300) {
      const next = await res.json()
      setErr(next.error);
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
  
    if (tooltipTimeout) setTooltipTimeout(clearTimeout(tooltipTimeout))

    setTooltipOpen(true)
  
    setTooltipTimeout(setTimeout(() => {
      setTooltipOpen(false)
    }, 2000))
  };

  useEffect(() => {
    const updateHandler = next => {
      if (process.env.NODE_ENV === 'development') {
        console.log("update recieved: ", next);
      }
      state.gameState = next;
      setState({player: state.player, gameState: state.gameState});
    }

    socket.on("update", updateHandler);
    return () => {
      socket.off("update", updateHandler);
    }
  }, [setState, socket, state.gameState, state.player]);

  return state.gameState.isStart ?
    <Redirect push to={`/game/${gameID}`}/> :
    (
    <Container component="h1" className={classes.container}>
      <Dialog open={err !== undefined} onClose={() => setErr(undefined)}>
        <DialogTitle>
          <Typography align="center">Error</Typography>
          <IconButton
            className={classes.close}
            onClick={() => setErr(undefined)}>
            <Close/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography align="center" component="h2">
            {err}
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
              <LobbyRoles call={call} off={off} state={state}/>
            </Grid>
            <Grid item container xs={12} align="center" direction="row">
              <Grid item xs={8}>
                <Typography variant="h5" className={classes.player}>
                  Players ready for match:
                </Typography>
                <LobbyPlayers call={call} state={state} />
              </Grid>
              <Grid item xs={1}>
                <Divider orientation="vertical" className={classes.vDivider}/>
              </Grid>
              <Grid item align="center" xs={3}>
                <Typography variant="h5" className={classes.copy}>
                  Share match id:
                </Typography>
                <Tooltip title={`Copied game id ${gameID} to clipboard`} open={tooltipOpen}>
                <Button
                  onClick={copy(gameID)}
                  variant="outlined"
                  startIcon={<Link/>}>
                  Copy
                </Button>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item xs={12} align="center">
              <Button disabled={!(gameState.isReady && isHost)} onClick={() => call("start", "")} variant="outlined">
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
