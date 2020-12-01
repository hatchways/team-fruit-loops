import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import {
  Grid,
  Button,
  Container,
  Paper
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: props => ({
    height: "100%",
    width: "100%",
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px rgba(149, 144, 144, .1)',
    textTransform: 'capitalize',
    "text-align": "center",
    whiteSpace: "nowrap",
    background:
          props.status === 'covered'
        ? 'white'
        : props.status === 'black'
        ? 'linear-gradient(to right, rgb(0, 0, 0), rgb(138, 138, 138))'
        : props.status === 'red'
        ? 'linear-gradient(to right, rgb(255, 0, 0), rgb(220, 20, 60))'
        : props.status === 'blue'
        ? 'linear-gradient(to right, rgb(0, 0, 255), rgb(30, 144, 255))'
        : 'linear-gradient(to right, rgb(128, 128, 128), rgb(192, 192, 192))',
    color: props.status !== "covered" ? "white" :
           props.color === undefined ? "black" : props.color,
    '&:hover': {
      boxShadow: props.status === "covered"? '0 3px 5px 2px rgba(0, 0, 0, .3)'
                 : null,
      backgroundColor: props.status === "covered" ? "white" : props.status,
    },
  }),
  board: {
    margin: "10vh 0 0 0",
    padding: "20px",
    height: "90vh",
    width: "100vw",
  },
  grid: {
    height: "100%",
    width: "100%",
  },
  prompt: {
    display: "flex",
  },
  promptContent: props => ({
    display: "block",
    color: props.promptColor,
    "margin-left": "auto",
    "margin-right": "auto",
  }),
  timer: props => ({
    color: props.timerColor,
  }),
  paper: {
    padding: "5px",
    margin: "10px"
  }
}));

const getRole = (player, gameState) => {
  const {blueSpy, redSpy, blueGuessers, redGuessers} = gameState;
  if (player === blueSpy) return "blue spy";
  if (player === redSpy) return "red spy";
  if (blueGuessers.includes(player)) return "blue guesser";
  if (redGuessers.includes(player)) return "red guesser";
}

const isSpy = role => role === "blue spy" || role === "red spy";

const Prompt = ({ state }) => {
  let prompt;
  const { player, gameState } = state;
  const { turn, hint, timer } = gameState;
  const [team, teamRole] = getRole(player, gameState).split(" ");
  const timerColor = gameState.timer < 10 ? 'red' : 'black';
  const classes = useStyles({promptColor: team, timerColor: timerColor});

  if (team !== turn) {
    prompt = `${turn} team's turn, you must wait`;
  }
  else {
    if (hint === undefined) {
      if (teamRole === 'spy')
        prompt = 'Your turn';
      else
        prompt = 'Waiting for the hint from your spy';
    }
    else {
      if (teamRole === 'spy')
        prompt = 'Waiting for your guessers';
      else
        prompt = 'Your turn';
    }
  }

  return (
    <Container className={classes.prompt} spacing={3}>
      <h1 className={classes.promptContent}>
        {prompt}
      </h1>
      <h1 className={classes.timer}>
        {timer}
      </h1>
    </Container>
  );
}

const Card = ({ status, color, word, onClick }) => {
  const classes = useStyles({status: status, color: color});
  const click = word => e => {
      e.preventDefault();
      onClick(word);
    };
  return (
    <Button className={classes.card} disableRipple={true} onClick={click(word)}>
     {word}
    </Button>
  );
};

const Board = ({ state, setState, gameID, onNextMove }) => {
  const classes = useStyles();
  const {player, gameState} = state;
  if (gameState === undefined) {
    return <Redirect to={'/match'} />
  }

  let {cards, boardState} = gameState;
  const playerRole = getRole(player, gameState);

  // create an array for rendering board
  const words = Object.keys(boardState).map(key => {
    return ({
      word: key,
      status: boardState[key].status,
      color: isSpy(playerRole) ? cards[key] : undefined,
    });
  });
  const wordsGrid = [];
  while(words.length) wordsGrid.push(words.splice(0,5));

  return (
    <div className={classes.board}>
      <Prompt state={state} />
      <Grid container spacing={3} justify="center" className={classes.grid}>
      {
        wordsGrid.map((row, rowIndex) =>
          <Grid container item key={rowIndex} xs={12} spacing={3} justify="center">
          {
            row.map((value, index) =>
              <Grid item key={index} xs={2}>
                <Card
                  word={value.word}
                  color={value.color}
                  status={value.status}
                  onClick={onNextMove}
                />
              </Grid>)
          }
          </Grid>
        )
      }
      </Grid>
    </div>
  )
}

export default Board;
