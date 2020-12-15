import React, { useEffect, useCallback, useState } from "react";
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
});

const getTeam = ({ player, gameState: { redSpy, blueSpy, redGuessers, blueGuessers} }) => {
  if (player === redSpy || redGuessers.includes(player))
    return 'red';
  else
    return 'blue';
}

const getRole = ({player, gameState: {blueSpy, redSpy, blueGuessers, redGuessers}}) => {
  if (player === blueSpy) return "blue spy";
  if (player === redSpy) return "red spy";
  if (blueGuessers.includes(player)) return "blue guesser";
  if (redGuessers.includes(player)) return "red guesser";
  else return "spectator"
}

const isSpy = ({ player, gameState: { redSpy, blueSpy } }) =>
  player === redSpy || player === blueSpy

const getCurrentSpymaster = ({ gameState: { turn, redSpy, blueSpy } }) => {
  if (turn === 'blue' && blueSpy) return blueSpy
  else if (turn === 'red' && redSpy) return redSpy
  else return 'N/A'
}

const GamePage = ({ classes, state, setState, socket, accountValues, logout }) => {
  const { gameID } = useParams();
  const { gameState, player } = state;
  const [timer, setTimer] = useState(gameState !== undefined ? gameState.timer : undefined);

  const [tick] = useSound(tickSfx, {volume: 0.1});
  const [correctGuess] = useSound(correctGuessSfx, {volume: 0.1});
  const [incorrectGuess] = useSound(incorrectGuessSfx, {volume: 0.1});
  const [gameWin] = useSound(winSfx, {volume: 0.1});
  const [gameLose] = useSound(loseSfx, {volume: 0.1});
  const sounds = {
    tick,
    correctGuess,
    incorrectGuess,
    gameWin,
    gameLose
  };

  const playSoundEffects = useCallback((nextState, err, word) => {
    if (err !== undefined) return;

    if (state.gameState.winner === undefined && nextState.winner !== undefined) {
      if (nextState.winner === getTeam(state))
        sounds.gameWin();
      else
        sounds.gameLose();

      return;
    }

    if (word !== undefined) {
      if (nextState.boardState[word].status !== state.gameState.turn)
        sounds.incorrectGuess();
      else
        sounds.correctGuess();
    }
  }, [sounds, state]);

  // This is responsible for re-rendering if websocket receives update
  // from front end.
  useEffect(() => {
    const updateHandler = ({gameState, error, word}) => {
      // // Re-enable comment if you want to continuously monitor game state
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('update recieved: ', next)
      // }
      playSoundEffects(gameState, error, word);
      if (error === undefined)
        setState({ player: player, gameState: gameState });
    }

    const timerHandler = ({gameState, timer}) => {
      if (timer <= 5)
        sounds.tick();

      if (gameState)
        setState({ player: player, gameState: gameState });

      setTimer(timer);
    }

    if (state.gameState && !state.gameState.isEnd) {
      socket.on('update', updateHandler);
      socket.on('timer', timerHandler);
    }

    return () => {
      socket.off('update', updateHandler);
      socket.off('timer', timerHandler);

      // setState({ player: player, gameState: undefined });
    }
  }, [setState, setTimer, sounds, socket, player, playSoundEffects, state]);

  if (gameID === undefined || gameState === undefined) {
    return <Redirect to='/match' />
  }

  // Event handler for selecting a card
  const onNextMove = word => {
    socket.emit('guesserNextMove', gameID, player, word);
  }

  // // Event handler for restarting the game
  // // Commented out as current iteration will not be using a restart feature
  // const onRestart = () => {
  //   socket.emit('restartGame', gameID);
  // }

  const onNewGame = () => {
    socket.emit('leave', gameID);
    setState({ player: state.player, gameID: undefined, gameState: undefined });
  }

  return (
    <Container className={classes.root}>
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
        countMax={8}
        token={state.gameState.hint || undefined}
        setFinished={undefined}
        getRole={getRole(state)}
        isSpy={isSpy(state)}
        getCurrentSpymaster={getCurrentSpymaster(state)}
      />
      <Board
        state={state}
        timer={timer}
        setState={setState}
        gameID={gameID}
        onNextMove={onNextMove}
        getRole={getRole(state)}
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
