import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import {
  Button,
  TextField,
  Typography,
  Container,
  Snackbar,
} from "@material-ui/core";

import MuiAlert from "@material-ui/lab/Alert";

import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";

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
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main
  }
}));

const Login = ({setAccountValues}) => {
  const classes = useStyles();
  let history = useHistory();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackBarMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/login", values)
      .then((res) => {
        // If login is successful, save info to global state variable and redirect to profile page
        setAccountValues({
          id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email,
          imageUrl: res.data.user.imageUrl
        })

        history.push("/menu");
      })
      .catch((err) => {
        setSnackBarMessage(err.response.data.errors);
        setSnackbarOpen(true);
      });
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            Don't have an account? <Link to="/signup" className={classes.link}>{"Sign Up"}</Link>
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

export default Login;
