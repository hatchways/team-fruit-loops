import React, { useState } from "react";
import { MuiThemeProvider, CssBaseline, Toolbar } from "@material-ui/core";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import Navbar from "./pages/Navbar";
import Chat from "./pages/Chat.js";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Match from "./pages/Match";
import Lobby from "./pages/Lobby";

import "./App.css";

function App() {
  const [state, setState] = useState({ player: "Bonnie", });

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
          <Route path="/match" render={ props => (
            <Match state={state} setState={setState} {...props} />
          )}/>
          <Route path="/lobby" component={Lobby} />
          <Route path="/chat" component={Chat} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
