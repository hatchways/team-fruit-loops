import React, { useState } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
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
import Public from "./pages/Public";

import "./App.css";


let socket = socketIOClient();
function App() {
  const [state, setState] = useState({player: 'Bonnie', gameID: undefined, gameState: undefined});
  const withGameState = Component => props => (
      <Component
        state={state}
        setState={setState}
        socket={socket}
        {...props}
      />
    );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar state={state}/>
        <Switch>
          <Redirect exact from="/" to="/signup" />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route exact path="/match" render={withGameState(Match)}/>
          <Route exact path="/public" render={withGameState(Public)}/>
          <Route  path="/lobby/:gameID" render={withGameState(Lobby)}/>
          <Route  path="/game/:gameID" render={withGameState(Game)}/>
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
