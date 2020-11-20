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

let socket = socketIOClient();
function App() {
  const [state, setState] = useState({player: "Bonnie", gameState: undefined}),
    [gameID, setGameID] = useState(undefined),
    withGameState = Component => props => (
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
        <Navbar />
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
