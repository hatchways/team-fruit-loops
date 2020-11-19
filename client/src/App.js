import React, { useState } from "react";
import { MuiThemeProvider, CssBaseline, Toolbar } from "@material-ui/core";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./pages/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat.js";
import Match from "./pages/Match";
import Lobby from "./pages/Lobby";

import "./App.css";

function App() {
  const [state, setState] = useState({ player: "Bonnie", })//,
    // withState = Page => props => (
    //   <Page state={state} setState={setState} {...props} />
    // )

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
            <Match state={state} setState={setState} {...props} />
          )} />
          <Route path="/lobby" render={props => (
            <Lobby state={state} setState={setState} {...props} />
          )} />
          <Route path="/chat" component={Chat} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
