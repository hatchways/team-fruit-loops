import React, { useEffect, useCallback } from "react";
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

import useSound from 'use-sound';
import tickSfx from '../assets/sounds/tick.mp3';
import correctGuessSfx from '../assets/sounds/correct_select.mp3';
import incorrectGuessSfx from '../assets/sounds/incorrect_select.mp3';
import winSfx from '../assets/sounds/game_win.mp3';
import loseSfx from '../assets/sounds/game_lose.mp3';

const styles = theme => ({
  root: {
    display: 'flex',
    padding: '0',
    margin: '0',
    maxWidth: '100vw'
  }
})

const getTeam = ({ player, gameState: { redSpy, blueSpy, redGuessers, blueGuessers} }) => {
  if (player === redSpy || redGuessers.includes(player))
    return 'red';
  else
    return 'blue';
}

const isSpy = ({ player, gameState: { redSpy, blueSpy } }) =>
  player === redSpy || player === blueSpy

const getCurrentSpymaster = ({ gameState: { turn, redSpy, blueSpy } }) => {
  if (turn === 'blue') return blueSpy
  else if (turn === 'red') return redSpy
  else return 'N/A'
}

const GamePage = ({ classes, state, setState, socket }) => {
  const { gameID } = useParams()
  const { gameState, player } = state

  const [tick] = useSound(tickSfx);
  const [correctGuess] = useSound(correctGuessSfx);
  const [incorrectGuess] = useSound(incorrectGuessSfx);
  const [gameWin] = useSound(winSfx);
  const [gameLose] = useSound(loseSfx);
  const sounds = {
    tick,
    correctGuess,
    incorrectGuess,
    gameWin,
    gameLose
  }

  const playSoundEffects = useCallback((nextState, err, word) => {
    if (nextState.timer < 10)
      sounds.tick();

    if (err !== null) return;

    if (nextState.winner !== undefined) {
      if (nextState.winner === getTeam(state))
        sounds.gameWin();
      else
        sounds.gameLose();

      return;
    }

    if (word !== undefined) {
      if (nextState.boardState[word].status !== state.gameState.turn) {
        sounds.incorrectGuess();
      }
      else {
        sounds.correctGuess();
      }
    }
  }, [sounds, state]);

  // This is responsible for re-rendering if websocket receives update
  // from front end.
  useEffect(() => {
    const updateHandler = (nextState, err = null, word = undefined) => {
      // // Re-enable comment if you want to continuously monitor game state
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('update recieved: ', next)
      // }
      playSoundEffects(nextState, err, word);

      if (err === null)
        setState({ player: player, gameState: nextState })
      else
        console.log(err)
    }

    socket.on('update', updateHandler)
    return () => {
      socket.off('update', updateHandler)
    }
  }, [setState, socket, gameID, player, playSoundEffects])

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

  const onNewGame = () => {
    socket.emit('leave', gameID)
    setState({ player: state.player, gameID: undefined, gameState: undefined })
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
        onNewGame={onNewGame}
      />
      <GameSidebar
        gameID={gameID}
        state={state}
        socket={socket}
        player={state.player}
        count={state.gameState.guessNum}
        countMax={5}
        token={state.gameState.hint || ''}
        setFinished={undefined}
        isSpy={isSpy(state)}
        getCurrentSpymaster={getCurrentSpymaster(state)}
      />
      <Board
        state={state}
        setState={setState}
        gameID={gameID}
        onNextMove={onNextMove}
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
