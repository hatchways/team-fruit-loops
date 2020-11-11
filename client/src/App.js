import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Match from "./pages/Match";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route exact path="/match" component={Match} />
        <Route exact path="/" component={LandingPage} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
