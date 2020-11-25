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
    display: 'flex',
    padding: '0',
    margin: '0',
    maxWidth: '100vw'
  }
})

const api = {
  nextMove: {
    url: id => `/game/${id}/next-move`,
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: (player, word) => JSON.stringify({ player, word })
  },
  restart: {
    url: id => `/game/${id}/restart`,
    method: 'PUT',
    headers: {
      Accept: 'application/json'
    },
    body: () => ''
  }
}

const isSpy = ({ player, gameState: { redSpy, blueSpy } }) =>
  player === redSpy || player === blueSpy

const getCurrentSpymaster = ({ gameState: { turn, redSpy, blueSpy } }) => {
  if (turn === 'blue') return blueSpy
  else if (turn === 'red') return redSpy
  else return 'N/A'
}

const getTeamSpymaster = ({
  player,
  gameState: { redSpy, redGuessers, blueSpy, blueGuessers }
}) => {
  if (player === redSpy || redGuessers.includes(player)) return redSpy
  else if (player === blueSpy || blueGuessers.includes(player)) return blueSpy
  else return 'N/A'
}

const GamePage = ({ classes, state, setState, socket }) => {
  const { gameID } = useParams()
  const { gameState, player } = state

  // This is responsible for re-rendering if websocket receives update
  // from front end.
  useEffect(() => {
    const updateHandler = next => {
      // // Re-enable comment if you want to continuously monitor game state
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('update recieved: ', next)
      // }
      state.gameState = next
      setState({ player: state.player, gameState: state.gameState })
    }

    socket.on('update', updateHandler)
    return () => {
      socket.off('update', updateHandler)
    }
  }, [setState, socket, state.gameState, state.player])

  // Socket handlers for next moves, ending turn, and restarting game
  useEffect(() => {
    socket.on('guesserNextMove', (payload, err) => {
      if (!err) {
        setState({ player: state.player, gameID: gameID, gameState: payload })
      } else {
        console.log(err)
      }
    })

    socket.on('spyNextMove', (payload, err) => {
      if (!err) {
        setState({ player: state.player, gameID: gameID, gameState: payload })

        console.log(payload)
      } else {
        console.log(err)
      }
    })

    socket.on('endTurn', payload => {
      setState({ player: state.player, gameID: gameID, gameState: payload })
    })

    socket.on('restartGame', payload => {
      setState({ player: state.player, gameID: gameID, gameState: payload })
    })
  }, [socket])

  if (gameID === undefined || gameState === undefined) {
    return <Redirect to='/match' />
  }

  // Event handler for selecting a card
  const onNextMove = word => {
    socket.emit('guesserNextMove', gameID, player, word)
  }

  // Event handler for restarting the game
  const onRestart = () => {
    socket.emit('restartGame', gameID)
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
        count={state.gameState.guessNum}
        countMax={5}
        token={state.gameState.hint || ''}
        setFinished={undefined}
        isSpy={isSpy(state)}
        getCurrentSpymaster={getCurrentSpymaster(state)}
        gameID={gameID}
        socket={socket}
      />
      <Board
        state={state}
        setState={setState}
        gameID={gameID}
        onNextMove={onNextMove}
        socket={socket}
      />
    </Container>
  )
}

GamePage.propTypes = {
  classes: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

const Game = withStyles(styles)(GamePage)

export default Game
