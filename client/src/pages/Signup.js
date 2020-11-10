import React, { useState } from "react";

import {
  Button,
  TextField,
  Link,
  Typography,
  Container,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

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

export default function Signup() {
  const classes = useStyles();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [errorPassword1, setErrorPassword1] = useState("");
  const [errorPassword2, setErrorPassword2] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation portion
    values["password1"].length < 6
      ? setErrorPassword1("Password must be at least 6 characters.")
      : setErrorPassword1("");

    values["password2"] !== values["password1"]
      ? setErrorPassword2("Paswords must match.")
      : setErrorPassword2("");

    // Validation passed
    if (errorPassword1 !== "" && errorPassword2 !== "") {
    }
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
            name="password1"
            type="password"
            id="password1"
            placeholder="Enter your password"
            onChange={(event) => {
              handleInputChange(event);
            }}
            error={errorPassword1 !== ""}
            helperText={errorPassword1}
          />{" "}
          <Typography variant="subtitle1">Confirm Password:</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            type="password"
            id="password2"
            placeholder="Enter your password"
            onChange={(event) => {
              handleInputChange(event);
            }}
            error={errorPassword2 !== ""}
            helperText={errorPassword2}
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
    </Container>
  );
}
