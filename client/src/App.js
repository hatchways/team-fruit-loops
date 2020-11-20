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
import BoardWrapper from "./pages/Board";

import "./App.css";

let socket = socketIOClient();
function App() {
  const [state, setState] = useState({player: "Bonnie", gameState: undefined});
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
          <Route path="/match" render={props => (
            <Match
              state={state}
              setState={setState}
              gameID={gameID}
              setGameID={setGameID}
              socket={socket}
              {...props}
            />
          )} />
          <Route path="/lobby/:gameID" render={props => (
            <Lobby
              state={state}
              setState={setState}
              gameID={gameID}
              socket={socket}
              {...props}
            />
          )} />
          <Route path="/board/:gameID" render={props => (
            <BoardWrapper
              state={state}
              setState={setState}
              socket={socket}
              {...props}
            />
          )} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
