import React, { useState } from "react";

import {
  Button,
  TextField,
  Link,
  Typography,
  Container,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
    boxShadow: "0 0 5px 0",
    padding: theme.spacing(3, 5),
    backgroundColor: "white",
  },
  underline: {
    width: "50px",
    height: "4px",
    color: "#32BE72",
    backgroundColor: "#32BE72",
  },
  form: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
  formButton: {
    display: "flex",
    margin: "24px auto 32px",
    textTransform: "none",
    backgroundColor: "#32BE72",
    color: "white",
    width: "120px",
    height: "40px",
  },
}));

const Login = () => {
  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/login", values)
      .then((res) => {
        // TODO: Success logic
      })
      .catch((err) => {
        // TODO: Error logic
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.root}>
        <Typography variant="h5">Sign in</Typography>
        <hr className={classes.underline} />
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography variant="subtitle1">Email:</Typography>
          <TextField
            id="email"
            name="email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            placeholder="johndoe@gmail.com"
            autoFocus
            onChange={(event) => {
              handleInputChange(event);
            }}
          />
          <Typography variant="subtitle1">Password:</Typography>
          <TextField
            id="password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={(event) => {
              handleInputChange(event);
            }}
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            className={classes.formButton}
          >
            Sign In
          </Button>
          <Typography align="center">
            Don't have an account? <Link href="/signup">{"Sign Up"}</Link>
          </Typography>
        </form>
      </div>
    </Container>
  );
};

export default Login;
