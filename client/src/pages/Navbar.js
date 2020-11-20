import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";


const baseRoot = {
  zIndex: 1300,
  backgroundColor: "white",
};

const useStyles = makeStyles((theme) => ({
  "*": { outline: "red" },
  root: {
    ...baseRoot,
    alignItems: "center",
  },
  gameRoot: {
    ...baseRoot,
  },
  profile: {
    position: "fixed",
    right: theme.spacing(0),
  },
  avatar: {
    position: "fixed",
    right: theme.spacing(15),
  },
  game: {
    display: "block",
    backgroundColor: "rgb(38, 182, 92);",
    color: "white",
    position: "fixed",
    right: theme.spacing(25),
  },
  hDivider: {
    height: "2px",
    width: theme.spacing(3),
    backgroundColor: "black",
  },
  inset: {
    position: "fixed",
    left: theme.spacing(36),
  },
  red: {
    color: "rgb(233, 97, 94);",
  },
  blue: {
    color: "rgb(99, 176, 244);",
  },
  blueteam: {
    width: "fit-content",
  },
  redteam: {
    width: "fit-content",
  },
  bluepoints: {
    width: "fit-content",
  },
  redpoints: {
    width: "fit-content",
  },
}));

const Inset = ({ blue, red, classes }) => {
  return (
    <div className={classes.inset}>
      <div className={classes.blue}>
        <Typography className={classes.bluePoints}>
          { blue }
        </Typography>
        <br/>
        <Typography className={classes.blueteam}>
          Blue Team
        </Typography>
      </div>
      <Divider className={classes.hDivider} variant="middle"/>
      <div className={classes.red}>
        <Typography className={classes.bluepoints}>
          { red }
        </Typography>
        <br/>
        <Typography className={classes.redpoints}>
          Red Team
        </Typography>
      </div>
    </div>
  );
};

const GameNavbar = ({ state: { bluePoints, redPoints }, classes }) => {
  return (
    <AppBar className={classes.gameRoot}>
      <Toolbar>
        <Typography variant="h1">CLUEWORDS</Typography>
        <Inset blue={bluePoints} red={redPoints} classes={classes} />
        <Button className={classes.game} variant="outlined">New Game</Button>
        <div className={classes.avatar}>
          <Avatar alt="Sofia" />
        </div>
        <Button
          className={classes.profile}
          endIcon={<ArrowDropDown/>}>
          My Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const test = {
  "playerList": ["Bonnie", "1", "3", "4"],
  "waitingList": [],
  "redSpy": "1",
  "redGuessers": ["4"],
  "blueSpy": "Bonnie",
  "blueGuessers": ["3"],
  "isReady": true,
  "isStart": true,
  "cards": {
      "banyan": "grey",
      "alb": "grey",
      "yarn": "blue",
      "chop": "grey",
      "alpaca": "blue",
      "jail": "blue",
      "gauge": "red",
      "marble": "red",
      "hedge": "red",
      "scrutiny": "red",
      "botany": "grey",
      "CD": "red",
      "croup": "blue",
      "brook": "grey",
      "steamroller": "blue",
      "cutting": "grey",
      "designation": "blue",
      "stew": "blue",
      "merchandise": "grey",
      "adrenalin": "grey",
      "output": "blue",
      "chrome": "black",
      "stacking": "red",
      "meaning": "red",
      "origin": "red"
  },
  "blueCardNum": 8,
  "redCardNum": 8,
  "whiteCardNum": 8,
  "blackCardNum": 1,
  "redPoints": 6,
  "bluePoints": 6,
  "turn": "blue",
  "guessNum": 0,
  "isEnd": false,
  "boardState": {
      "banyan": {
        "status": "covered"
      },
      "alb": {
        "status": "covered"
      },
      "yarn": {
        "status": "covered"
      },
      "chop": {
        "status": "covered"
      },
      "alpaca": {
        "status": "covered"
      },
      "jail": {
        "status": "covered"
      },
     "gauge": {
        "status": "covered"
      },
      "marble": {
        "status": "covered"
      },
      "hedge": {
        "status": "covered"
      },
      "scrutiny": {
        "status": "covered"
      },
      "botany": {
        "status": "covered"
      },
      "CD": {
        "status": "covered"
      },
      "croup": {
        "status": "covered"
      },
      "brook": {
        "status": "covered"
      },
      "steamroller": {
        "status": "covered"
      },
      "cutting": {
        "status": "covered"
      },
      "designation": {
        "status": "covered"
      },
      "stew": {
        "status": "covered"
      },
      "merchandise": {
        "status": "covered"
      },
      "adrenalin": {
        "status": "covered"
      },
      "output": {
        "status": "covered"
      },
      "chrome": {
        "status": "covered"
      },
      "stacking": {
        "status": "covered"
      },
      "meaning": {
        "status": "covered"
      },
      "origin": {
        "status": "covered"
      }
  },
  "timer": 10
};

const Navbar = ({ location, }) => {
  const classes = useStyles();

  if (location.pathname === "/game") {
    return <GameNavbar state={test} classes={classes} />;
  };

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Typography variant="h1">CLUEWORDS</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
