import React, { useState } from "react";
import { MuiThemeProvider, CssBaseline, Toolbar } from "@material-ui/core";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { theme } from "./themes/theme";

import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./pages/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Match from "./pages/Match";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

import "./App.css";

// sample state
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
  "redPoints": 0,
  "bluePoints": 0,
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

let socket = socketIOClient();
function App() {
  const [gameID, setGameID] = useState(undefined);
  const [state, setState] = useState({player: "Bonnie", gameState: test});
  const withGameState = Component => props => (
      <Component
        state={state}
        setState={setState}
        gameID={gameID}
        setGameID={setGameID}
        socket={socket}
        {...props}
      />
    );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar state={state}/>
        <Toolbar />
        <Switch>
          <Redirect exact from="/" to="/signup" />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/match" render={withGameState(Match)}/>
          <Route path="/lobby/:gameID" render={withGameState(Lobby)}/>
          <Route path="/game" render={withGameState(Game)}/>
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
