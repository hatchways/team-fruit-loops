import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import {
  Grid,
  Button,
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
    backgroundColor: props.status === "covered" ? "white" : props.status,

    //props.status === "covered" ? "white" : props.status,
    color: props.status !== "covered" ? "white" :
           props.color === undefined ? "black" : props.color,
    '&:hover': {
      boxShadow: props.status === "covered"? '0 3px 5px 2px rgba(0, 0, 0, .3)'
                 : null,
      backgroundColor: props.status === "covered" ? "white" : props.status,
    },
  }),
  board: {
    height: 500,
    width: "100%",
  },
  grid: {
    height: "inherit",
    width: "inherit",
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

const Board = ({ state, setState, gameID, socket}) => {
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
      <div>
        Turn: {gameState.turn}
      </div>
      <div>
        Player: {player}
      </div>
      <div>
        Role: {getRole(player, gameState)}
      </div>
      <div>
        Remaining guess number: {gameState.guessNum}
      </div>
      <div>
        Winner: {gameState.winner === undefined ? '' : gameState.winner}
      </div>
      <Button onClick={() => onRestart()}> restart </Button>
    </div>
  )
}

export default Board;
