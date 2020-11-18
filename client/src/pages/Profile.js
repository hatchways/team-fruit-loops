import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import { Button, TextField, Typography, Container } from "@material-ui/core";

import UploadImage from "../components/uploadImage";

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
    width: "120px",
    height: "40px",
  },
}));

const Profile = () => {
  const classes = useStyles();
  let history = useHistory();

  const [values, setValues] = useState({
    id: "",
    name: "",
    email: "",
    imageUrl: "",
  });

  const logout = () => {
    axios
      .get("/logout")
      .then((res) => {})
      .catch((err) => {})
      .finally(() => history.push("/login"));
  };

  useEffect(() => {
    axios
      .get("/account")
      .then((res) => {
        setValues({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          imageUrl: res.data.imageUrl,
        });
      })
      .catch((err) => {
        logout();
      });
  });

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.root}>
        <>
          {values["name"] !== "" ? (
            <>
              <Typography variant="h5">Profile</Typography>
              <hr className={classes.underline} />
              <form className={classes.form}>
                <Typography variant="subtitle1">Name:</Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={values["name"]}
                  disabled
                />
                <Typography variant="subtitle1">Email:</Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={values["email"]}
                  disabled
                />
                <Typography variant="subtitle1">Profile Picture:</Typography>
                <UploadImage values={values} setValues={setValues} />
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.formButton}
                  onClick={logout}
                >
                  Logout
                </Button>
              </form>{" "}
              <br />
            </>
          ) : (
            <></>
          )}
        </>
      </div>
    </Container>
  );
};

export default Profile;
