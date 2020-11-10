import React from "react";
import { MuiThemeProvider, CssBaseline, Toolbar } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";

import Navbar from "./pages/Navbar";
import LandingPage from "./pages/Landing";
import Chat from "./pages/Chat.js";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Toolbar />
      <BrowserRouter>
        <Route path="/" exact component={LandingPage} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/chat" component={Chat}/>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
