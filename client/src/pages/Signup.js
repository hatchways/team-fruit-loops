import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  Button,
  TextField,
  Link,
  Typography,
  Container,
  Snackbar,
} from "@material-ui/core";

import MuiAlert from "@material-ui/lab/Alert";

import { makeStyles } from "@material-ui/core/styles";

const axios = require("axios");

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const Signup = () => {
  const classes = useStyles();
  let history = useHistory();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackBarMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation portion
    values["password"].length < 6
      ? setErrorPassword("Password must be at least 6 characters.")
      : setErrorPassword("");

    values["confirmPassword"] !== values["password"]
      ? setErrorConfirmPassword("Paswords must match.")
      : setErrorConfirmPassword("");

    // Validation passed
    if (
      errorPassword === "" &&
      errorConfirmPassword === "" &&
      values["confirmPassword"] === values["password"]
    ) {
      axios
        .post("/register", values)
        .then((res) => {
          // TODO: Success logic
          // ISSUE: Logic never reaches this block even with account success
          history.push("/profile");
        })
        .catch((err) => {
          setSnackBarMessage(err.response.data.errors);
          setSnackbarOpen(true);
        })
        .then(() => {});
    }
  };

  const handleSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.root}>
        <Typography variant="h5">Sign Up</Typography>
        <hr className={classes.underline} />
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography variant="subtitle1">Name:</Typography>
          <TextField
            id="name"
            name="name"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            placeholder="Enter your name"
            autoFocus
            onChange={(event) => {
              handleInputChange(event);
            }}
          />
          <Typography variant="subtitle1">Email:</Typography>
          <TextField
            id="email"
            name="email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            placeholder="Enter your email"
            onChange={(event) => {
              handleInputChange(event);
            }}
          />
          <Typography variant="subtitle1">Password:</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={(event) => {
              handleInputChange(event);
            }}
            error={errorPassword !== ""}
            helperText={errorPassword}
          />{" "}
          <Typography variant="subtitle1">Confirm Password:</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            onChange={(event) => {
              handleInputChange(event);
            }}
            error={errorConfirmPassword !== ""}
            helperText={errorConfirmPassword}
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            className={classes.formButton}
          >
            Create Account
          </Button>
          <Typography>
            Already have an account? <Link href="/login">{"Sign In"}</Link>
          </Typography>
        </form>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbar}
      >
        <Alert onClose={handleSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Signup;
