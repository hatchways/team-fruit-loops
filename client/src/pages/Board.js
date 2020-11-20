import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Board from "../components/Board";

const useStyles = makeStyles((theme) => ({
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
}));


const BoardWrapper = ({ state, setState}) => {
  const click = (word) => {
    const color = state.cards[word];
    state.boardState[word].status = color;
    setState({...state});
  }
  return (
    <Board
      state={state}
      onClick={click}
    />
  );
};

export default BoardWrapper;
