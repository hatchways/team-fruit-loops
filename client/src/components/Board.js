import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

const Board = ({ state, onClick}) => {
  const classes = useStyles();
  const {cards, boardState} = state;
  const words = Object.keys(boardState).map(key => {
    return ({
      word: key,
      status: boardState[key].status,
      color: cards === undefined ? undefined : cards[key],
    });
  });
  const wordsGrid = [];
  while(words.length) wordsGrid.push(words.splice(0,5));
  console.log("in board", onClick)
  console.log(wordsGrid)
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
                  onClick={onClick}
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
