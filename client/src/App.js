import React from "react";
import { MuiThemeProvider, CssBaseline, Toolbar } from "@material-ui/core";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import Navbar from "./pages/Navbar";
import Chat from "./pages/Chat.js";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Match from "./pages/Match";
import Game from "./pages/Game";

import "./App.css";

function App() {
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
          <Route exact path="/match" component={Match} />
          <Route exact path="/game" component={Game} />
          <Route path="/chat" component={Chat}/>
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
