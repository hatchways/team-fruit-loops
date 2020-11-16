import React from "react";
import { MuiThemeProvider, CssBaseline, Toolbar } from "@material-ui/core";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import Navbar from "./pages/Navbar";
// import LandingPage from "./pages/Landing";
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
        <Switch>
          {/* Using 'exact' keyword here screws up the /ping page; may require fixing */}
          {/* <Route path="/" exact component={LandingPage} /> */}
          <Redirect exact from="/" to="/signup" />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
