import React, { useState, useEffect }from 'react';
import { Redirect, useHistory } from "react-router-dom";
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

const api = {
  "private": {
    url: () => "/game",
    method: "POST",
    contentType: "application/json",
    body: (player, socketID) => JSON.stringify({ player, socketID }),
  },
  "join": {
    url: id => `/game/${id}/join`,
    method: "PUT",
    contentType: "application/json",
    body: (player, socketID) => JSON.stringify({ player, socketID }),
  },
  "random": {
    url: () => {
      throw new Error("Error: not implemented");
    },
  },
  "checkPrivate": {
    url: player => `/stripe/${player}/private-enabled`,
    method: () => "GET",
    headers: () => ({
      Accept: "application/json",
    }),
  }
};

const Match = withStyles(styles)(({ classes, state, setState, socket, accountValues}) => {
  const [err, setErr] = useState(undefined);
  const { player, gameID } = state;
  // local game id. used in join a game text field
  const [roomID, setRoomID] = useState('');
  const [name, setName] = useState('');
  const [privGames, setPrivGames] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setName((accountValues.name !== "" && accountValues.name)|| "Guest_" + Math.floor(Math.random() * (10000 - 1000) + 1000))
  }, [accountValues.name])


  useEffect(() => {
    // ask backend if player has private games enabled
    const privHandler = async () => {
      const res = await fetch(api["checkPrivate"].url(accountValues.name), {
        method: api["checkPrivate"].method(),
        headers: api["checkPrivate"].headers(),
      });

      try {
        const { enabled } = await res.json();
        if (enabled) {
          setPrivGames(true);
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.log(err);
        }
      }
    };

    if (accountValues.name !== "") {
      privHandler();
    }
  }, [accountValues.name]);

  if (gameID !== undefined) {
    return <Redirect push to={`/lobby/${gameID}`}/>;
  }

  const call = type => async () => {
    try {
      const res = await fetch(api[type].url(gameID), {
        method: api[type].method,
        headers: {
          "Content-Type": api[type].contentType,
          Accept: "application/json",
        },
        body: api[type].body(player, socket.id),
      });

      const nextState = await res.json();
      if (res.status >= 200 && res.status < 300) {
        setState({
          player: player,
          gameID: nextState.id,
          gameState: nextState.gameState
        });
      } else {
        setErr(nextState.error);
      }
    } catch(err) {
      setErr("Error starting game");
    }
  }

  const join = (id, name) => async () => {
    const testName = name;
    const type = 'join';
    const res = await fetch(api[type].url(id), {
      method: api[type].method,
      headers: {
        "Content-Type": api[type].contentType,
        Accept: "application/json",
      },
      body: api[type].body(testName, socket.id),
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

  const onPublic = () => {
    history.push('public/');
  }

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
              </form>
              {/* Don't show this because it's not implemented (yet) */}
              {/* <Title css={classes.or} title="Or" el="h6"/>
              <Button
                onClick={() => setErr("not implemented")}
                className={classes.random}
                variant="outlined">
                Join Random
              </Button> */}
            </Grid>
            <Grid item xs={1}>
              <Divider orientation="vertical" className={classes.vDivider}/>
            </Grid>
            <Grid item container xs={3}>
              {/* <Grid item container xs={12}>
                <Title css={classes.new} title="New Game:" el="h6"/>
              </Grid> */}
              <Grid item container xs={12}>
                <Title className={classes.new} title="New Game:" el="h6"/>
              </Grid>
              <Grid item container
                xs={12}
                direction="column"
                className={classes.newGame}
                justify="center">
                <Button
                  onClick={onPublic}
                  className={classes.public}
                  variant="outlined">
                  Public
                </Button>
                <Button
                  disabled={!privGames}
                  onClick={call("private")}
                  className={classes.private}
                  variant="outlined">
                  Private
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
});

export default Match;
