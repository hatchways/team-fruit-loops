import React from "react";

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

export default function Login() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.root}>
        <Typography variant="h5">Sign in</Typography>
        <hr className={classes.underline} />
        <form className={classes.form}>
          <Typography variant="subtitle1">Email:</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            placeholder="johndoe@gmail.com"
            name="email"
            autoFocus
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
          />
          <Link href="#">Forgot your password?</Link>
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
}
