import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Button, Typography } from "@material-ui/core";

const axios = require("axios");

const Profile = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/profile")
      .then((res) => {
        setValues({
          name: res.data.name,
          email: res.data.email,
        });
      })
      .catch((err) => {
        logout();
      });
  }, []);

  let history = useHistory();

  const logout = () => {
    axios
      .get("/logout")
      .then((res) => {})
      .catch((err) => {})
      .finally(() => history.push("/login"));
  };

  return (
    <>
      <Typography>{"Welcome " + values["name"]}</Typography>
      <br />
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
    </>
  );
};

export default Profile;
