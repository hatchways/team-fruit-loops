import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from 'react-router';
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
} from "@material-ui/core";
import PropTypes from 'prop-types';

import Finished from "../components/Game/Finished";
import GameSidebar from "../components/Sidebar";
import Board from "../components/Game/Board";
import GameNavbar from "../components/Game/Nav";

const styles = theme => ({
  root: {
    display: "flex",
    padding: "0",
    margin: "0",
    maxWidth: "100vw",
  }
});

const api = {
  "nextMove": {
    url: id => `/game/${id}/next-move`,
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: (player, word) => JSON.stringify({ player, word }),
  },
  "restart": {
    url: id => `/game/${id}/restart`,
    method: "PUT",
    headers: {
      Accept: "application/json",
    },
    body: () => "",
  },
};


const isSpy = ({player, gameState: {redSpy, blueSpy}}) => (
  player === redSpy || player === blueSpy
);

const GamePage = ({ classes, state, setState, socket}) => {
  const { gameID } = useParams();
  const {gameState, player} = state;

  // This is responsible for re-rendering if websocket receives update
  // from front end.
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


  if (gameID === undefined || gameState === undefined) {
    return (<Redirect to="/match" />);
  }

  // event handler for selecting a card
  const onNextMove = async(word) => {
    const type = "nextMove"
    const res = await fetch(api[type].url(gameID), {
      method: api[type].method,
      headers: api[type].headers,
      body: api[type].body(player, word),
    });

    if (res.status < 200 || res.status >= 300) {
      const next = await res.json()
      console.log(next)
    }
  }

  // event handler for restarting the game
  const onRestart = async() => {
    const type = "restart"
    const res = await fetch(api[type].url(gameID), {
      method: api[type].method,
      headers: api[type].headers,
    });

    if (res.status < 200 || res.status >= 300) {
      const next = await res.json()
      console.log(next)
    }
  }

  return (
    <Container className={classes.root}>
      <GameNavbar
        setState={setState}
        state={state}
        onRestart={onRestart}
      />
      <Finished
        setState={setState}
        state={state}
      />
      <GameSidebar
        state={state}
        player={state.player}
        count={4}
        countMax={5}
        token="Animals"
        setFinished={undefined}
        isSpy={isSpy(state)}
      />
      <Board
        state={state}
        setState={setState}
        gameID={gameID}
        onNextMove={onNextMove}
        socket={socket}
      />
    </Container>
  );
};

GamePage.propTypes = {
  classes: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

const Game = withStyles(styles)(GamePage);

export default Game;
