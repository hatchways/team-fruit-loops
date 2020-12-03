import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Dialog, DialogTitle, DialogContent,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import GameTable from '../components/Public/GameTable';
import GameForm from '../components/Public/GameForm';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '12vh',
    display: 'flex',
    height: '80vh',
    width: '100%',
  },
  close: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  }
}));

const api = {
  'public': {
    url: () => '/game',
    method: 'POST',
    contentType: 'application/json',
    body: (player, socketID, isPublic, maxPlayerNum) => JSON.stringify({ player, socketID, isPublic, maxPlayerNum }),
  },
  "join": {
    url: id => `/game/${id}/join`,
    method: "PUT",
    contentType: "application/json",
    body: (player, socketID) => JSON.stringify({ player, socketID }),
  },
}

const Public = ({state, setState, socket, accountValues}) => {
  const classes = useStyles();
  const history = useHistory();
  const [player, setPlayer] = useState('player1');
  const [gameList, setGameList] = useState([]);
  const [err, setErr] = useState(undefined);

  const onCreateGame = async (maxPlayerNum) => {
    const type = 'public';
    const res = await fetch(api[type].url(), {
      method: api[type].method,
      headers: {
        'Content-Type': api[type].contentType,
        Accept: 'application/json',
      },
      body: api[type].body(player, socket.id, true, maxPlayerNum),
    });

    const nextState = await res.json();
    if (res.status >= 200 && res.status < 300) {
      setState({
        player: player,
        gameID: nextState.id,
        gameState: nextState.gameState
      });
      history.push(`/lobby/${nextState.id}`);
    } else {
      setErr(nextState.error);
    }
  }

  const onJoin = async (id) => {
    const testName = player;
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
        player: player,
        gameID: id,
        gameState: nextState.gameState
      });
      history.push(`/lobby/${id}`);
    } else {
      setErr(nextState.error);
    }
  };

  const onRefresh = () => {
    socket.emit('refreshPublic');
  }

  useEffect(() => {
    if (accountValues.name) {
      setPlayer(accountValues.name)
    }

    const updateHandler = ({gameList, error}) => {
      if (error === undefined)
        setGameList(gameList);
    }
    socket.emit('refreshPublic');
    socket.on('publicGames', updateHandler);

    return () => {
      socket.off('publicGames', updateHandler);
    }
  }, [setState, socket, accountValues.name]);

  return (
    <Container className={classes.root}>
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
      <GameTable
        gameList={gameList}
        onJoin={onJoin}
        onRefresh={onRefresh}
      />
      <GameForm
        playerName={player}
        setPlayerName={setPlayer}
        onCreateGame={onCreateGame}
        accountValues={accountValues}
      />
    </Container>
  );
}

export default Public ;
