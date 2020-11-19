import React, { useState }from 'react';
import { Redirect } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Container,
  Card, CardContent,
  Divider,
  Grid,
  Typography,
  Button, TextField,
  Dialog, DialogTitle, DialogContent,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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
  public: {
    marginTop: theme.spacing(1),
    marginLeft: "25%",
    width: "50%",
  },
  private: {
    marginTop: theme.spacing(1),
    marginLeft: "25%",
    width: "50%",
  },
  newGame: {
    height: "min-content",
  },
  close: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  }
});

const Title = ({ el, title, css, }) => (
  <Typography variant={el} className={css}>{ title }</Typography>
);

const Btn = ({ on, css, text }) => (
  <Button onClick={on} className={css} variant="outlined">{ text }</Button>
);

const api = {
  "private": {
    url: () => "/game",
    method: "POST",
    contentType: "application/x-www-form-urlencoded",
    body: player => `player=${player}`,
  },
  "join": {
    url: id => `/game/${id}/join`,
    method: "PUT",
    contentType: "application/json",
    body: player => JSON.stringify({ player }),
  },
  "random": {
    url: () => {
      throw new Error("Error: not implemented");
    },
  },
};

const Match = withStyles(styles)(({ classes, state, setState, gameID, setGameID, socket}) => {
  const [err, setErr] = useState(undefined);
  const { player } = state;
  // local game id. used in join a game text field
  const [id, setId] = useState('');

  if (gameID !== undefined) {
    return <Redirect push to={`/lobby/${gameID}`}/>;
  }

  const call = type => async () => {
    const res = await fetch(api[type].url(gameID), {
      method: api[type].method,
      headers: {
        "Content-Type": api[type].contentType,
        Accept: "application/json",
      },
      body: api[type].body(player),
    });

    const nextState = await res.json();
    if (res.status >= 200 && res.status < 300) {
      socket.emit('join', nextState.id);
      setState({player: player, gameState: nextState.gameState});
      setGameID(nextState.id);
    } else {
      setErr(nextState.error);
    }
  }

  const join = id => async () => {
    const testName = "Alice";
    socket.emit('join', id);
    const type = 'join';
    const res = await fetch(api[type].url(id), {
      method: api[type].method,
      headers: {
        "Content-Type": api[type].contentType,
        Accept: "application/json",
      },
      body: api[type].body(testName),
    });

    const nextState = await res.json();
    if (res.status >= 200 && res.status < 300) {
      setState({player: testName, gameState: nextState.gameState});
      setGameID(id);
    } else {
      setErr(nextState.error);
    }
  };

  return state.gameID !== undefined
    ? <Redirect push to={`/lobby/${gameID}`}/>
    : (
    <Container>
      <Dialog open={err !== undefined} onClose={() => setErr(undefined)}>
        <DialogTitle>
          <Typography align="center">Error</Typography>
          <IconButton
            className={classes.close}
            onClick={() => setErr(undefined)}>
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography align="center" component="h2">
            {err}
          </Typography>
        </DialogContent>
      </Dialog>
      <Card className={classes.card}>
        <CardContent>
          <Title css={classes.header} title="Welcome" el="h3"/>
          <Divider className={classes.hDivider} variant="middle"/>
          <Grid container align="center">
            <Grid item xs={8}>
              <Title css={classes.join} title="Join a Game:" el="h6"/>
              <form className={classes.form}>
                <TextField
                  fullWidth
                  value={id}
                  onChange={({ target: { value }}) => setId(value)}
                  variant="outlined"
                  className={classes.text}
                  placeholder="Enter Game ID"
                  InputProps={{endAdornment: (
                    <Button
                      onClick={join(id)}
                      className={classes.game}
                      variant="outlined">
                      Join Game
                    </Button>
                  )}}/>
              </form>
              <Title css={classes.or} title="Or" el="h6"/>
              <Button
                onClick={call("random")}
                className={classes.random}
                variant="outlined">
                Join Random
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Divider orientation="vertical" className={classes.vDivider}/>
            </Grid>
            <Grid item container xs={3}>
              <Grid item container xs={12}>
                <Title css={classes.new} title="New Game:" el="h6"/>
              </Grid>
              <Grid item container
                xs={12}
                direction="column"
                className={classes.newGame}
                justify="center">
                <Btn on={call("public")} css={classes.public} text="Public"/>
                <Btn on={call("private")} css={classes.private} text="Private"/>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
});

export default Match;
