import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";

const axios = require("axios");

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("/profile")
      .then((res) => {
        setIsAuthenticated(true);
      })
      .catch((err) => {})
      .finally(() => setIsLoaded(true));
  }, [isAuthenticated]);

  if (!isLoaded) return <></>;

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
