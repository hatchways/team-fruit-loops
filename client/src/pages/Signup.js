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

export default function Signup() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.root}>
        <Typography variant="h5">Sign Up</Typography>
        <hr className={classes.underline} />
        <form className={classes.form}>
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
          />
          <Typography variant="subtitle1">Email:</Typography>
          <TextField
            id="email"
            name="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            placeholder="Enter your email"
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
