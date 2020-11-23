import React, { useState } from "react";
import { MuiThemeProvider, CssBaseline, Toolbar } from "@material-ui/core";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { theme } from "./themes/theme";

import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Match from "./pages/Match";
import Lobby from "./pages/Lobby";
import Test from "./pages/Test";
import BoardWrapper from "./pages/Board";

import "./App.css";

let socket = socketIOClient();
function App() {
  const [state, setState] = useState({
    player: "Bonnie",
    // gameState: undefined,
    gameState: {
      playerList: ["Player 1", "Player 2", "Player 3", "Player 4"],
      waitingList: [],
      redSpy: "Bonnie",
      redGuessers: ["Bonnie"],
      blueSpy: "Bonnie",
      blueGuessers: ["Bonnie"],
      isReady: true,
      isStart: true,
      cards: {
        speed: "grey",
        wallet: "grey",
        security: "red",
        canteen: "grey",
        cornet: "blue",
        sock: "blue",
        timeline: "blue",
        font: "blue",
        street: "red",
        data: "blue",
        "arch-rival": "red",
        appeal: "grey",
        pathology: "red",
        jot: "red",
        senate: "red",
        potential: "red",
        skunk: "grey",
        wine: "grey",
        weather: "black",
        hip: "blue",
        hiking: "red",
        punctuation: "grey",
        future: "blue",
        bias: "blue",
        wind: "grey",
      },
      blueCardNum: 8,
      redCardNum: 8,
      greyCardNum: 8,
      blackCardNum: 1,
      redPoints: 0,
      bluePoints: 0,
      turn: "blue",
      guessNum: 2,
      isEnd: false,
      boardState: {
        speed: {
          status: "covered",
        },
        wallet: {
          status: "covered",
        },
        security: {
          status: "covered",
        },
        canteen: {
          status: "covered",
        },
        cornet: {
          status: "covered",
        },
        sock: {
          status: "covered",
        },
        timeline: {
          status: "covered",
        },
        font: {
          status: "covered",
        },
        street: {
          status: "covered",
        },
        data: {
          status: "covered",
        },
        "arch-rival": {
          status: "covered",
        },
        appeal: {
          status: "covered",
        },
        pathology: {
          status: "covered",
        },
        jot: {
          status: "covered",
        },
        senate: {
          status: "covered",
        },
        potential: {
          status: "covered",
        },
        skunk: {
          status: "covered",
        },
        wine: {
          status: "covered",
        },
        weather: {
          status: "covered",
        },
        hip: {
          status: "covered",
        },
        hiking: {
          status: "covered",
        },
        punctuation: {
          status: "covered",
        },
        future: {
          status: "covered",
        },
        bias: {
          status: "covered",
        },
        wind: {
          status: "covered",
        },
      },
      timer: 20,
    },
  });
  const [gameID, setGameID] = useState(undefined);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Toolbar />
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/signup" />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route
            path="/match"
            render={(props) => (
              <Match
                state={state}
                setState={setState}
                gameID={gameID}
                setGameID={setGameID}
                socket={socket}
                {...props}
              />
            )}
          />
          <Route
            path="/lobby/:gameID"
            render={(props) => (
              <Lobby
                state={state}
                setState={setState}
                gameID={gameID}
                socket={socket}
                {...props}
              />
            )}
          />
          <Route
            path="/board/:gameID"
            render={(props) => (
              <BoardWrapper
                state={state}
                setState={setState}
                socket={socket}
                {...props}
              />
            )}
          />
          <Route
            path="/test"
            render={(props) => <Test socket={socket} {...props} />}
          />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
