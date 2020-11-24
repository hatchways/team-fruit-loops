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

const styles = theme => ({
  header: {
    textAlign: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
  card: {
    marginTop: theme.spacing(3),
  },
  hDivider: {
    height: "1px",
    backgroundColor: "rgb(72, 172, 122)",
    marginLeft: theme.spacing(33),
    marginRight: theme.spacing(33),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  vDivider: {
    width: "1px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  join: {
    textAlign: "left",
    marginLeft: theme.spacing(3),
    fontWeight: "bold",
  },
  game: {
    whiteSpace: "nowrap",
    backgroundColor: "rgb(75, 75, 75)",
    width: "100%",
    color: "white",
  },
  random: {
    whiteSpace: "nowrap",
    backgroundColor: "rgb(75, 75, 75)",
    color: "white",
    width: "50%",
  },
  new: {
    fontWeight: "bold",
    height: theme.spacing(0),
  },
  form: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(5),
  },
  or: {
    fontWeight: "bold",
    marginTop: theme.spacing(1),
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

const Match = withStyles(styles)(({ classes, state, setState, socket}) => {
  const [err, setErr] = useState(undefined);
  const { player, gameID } = state;
  // local game id. used in join a game text field
  const [roomID, setRoomID] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState(undefined);

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
      setState({
        player: player,
        gameID: nextState.id,
        gameState: nextState.gameState
      });
    } else {
      setErr(nextState.error);
    }
  }

  const join = (id, name) => async () => {
    const testName = name;
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
      setState({
        player: name,
        gameID: id,
        gameState: nextState.gameState
      });
    } else {
      setErr(nextState.error);
    }
  };

  return gameID !== undefined
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
                  value={roomID}
                  onChange={({ target: { value }}) => setRoomID(value)}
                  variant="outlined"
                  className={classes.text}
                  placeholder="Enter Game ID"
                  InputProps={{endAdornment: (
                    <Button
                      onClick={join(roomID, name)}
                      className={classes.game}
                      variant="outlined">
                      Join Game
                    </Button>
                  )}}/>
                  <TextField
                    fullWidth
                    value={name}
                    onChange={({ target: { value }}) => setName(value)}
                    variant="outlined"
                    className={classes.text}
                    placeholder="Enter name"
                    />
              </form>
              <Title css={classes.or} title="Or" el="h6"/>
              <Button
                onClick={() => setErr("not implemented")}
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
                <Btn on={() => setErr("not implemented")} css={classes.public} text="Public"/>
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
