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
    backgroundColor:
          props.status === 'covered'
        ? 'white'
        : props.status === 'black'
        ? 'rgb(0, 0, 0)'
        : props.status === 'red'
        ? 'rgb(255, 62, 59)'
        : 'rgb(95, 63, 254)',
    backgroundImage:
      props.status === 'covered'
        ? 'white'
        : props.status === 'black'
        ? 'linear-gradient(to right, rgb(0, 0, 0), rgb(138, 138, 138))'
        : props.status === 'red'
        ? 'linear-gradient(to right, rgb(255, 62, 59), rgb(254, 100, 63))'
        : 'linear-gradient(to right, rgb(59, 66, 255), rgb(95, 63, 254))',
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

const Card = ({status, color, word, onClick}) => {
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

const Board = ({ state, setState, gameID, socket, onNextMove }) => {
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
      <Container className={classes.prompt} spacing={3}>
      <Paper className={classes.paper}> Time remaining: {gameState.timer} </Paper>
      <Paper className={classes.paper}className={classes.paper}>
        Turn: {gameState.turn}
      </Paper>
      <Paper className={classes.paper}>
        Player: {player}
      </Paper>
      <Paper className={classes.paper}>
        Role: {getRole(player, gameState)}
      </Paper>
      <Paper className={classes.paper}>
        Remaining guess number: {gameState.guessNum}
      </Paper>
      </Container>
    </div>
  )
}

export default Board;
