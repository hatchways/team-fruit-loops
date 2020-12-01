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
import Upgrade from "./pages/Upgrade";
import Public from "./pages/Public";

import "./App.css";

const stripePubKey = process.env.REACT_APP_STRIPE_PUB_KEY;

if (stripePubKey === "") {
  console.log("Warning: Stripe public key undefined");
}

let socket = socketIOClient();
function App() {
  const [privGames, setPrivGames] = useState(false);
  const [state, setState] = useState({
    player: 'testIntent2',
    gameID: undefined,
    gameState: undefined
  });
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
          <PrivateRoute path="/profile" component={ props => (
            <Profile
              stripePubKey={stripePubKey}
              privGames={privGames}
              setPrivGames={setPrivGames}
              {...props}/>
          )} />
          <Route path="/stripe/:player" component={withGameState(Upgrade)}/>
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
