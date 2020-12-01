import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types';
import {
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import {
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import SendIcon from "@material-ui/icons/Send";

import Upgrade from "../components/Upgrade";
import UploadImage from "../components/uploadImage";

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
  editButton: {},
  upgradeButton: {
    backgroundColor: "rgb(38, 182, 92)",
    marginTop: theme.spacing(5),
    width: "120px",
    height: "40px",
  },
  paid: {
    width: "80%",
  },
}));

const api = {
  "createIntent": {
    url: name => `/stripe/${name}/intent`,
    method: () => "GET",
    headers: () => ({
      Accept: "application/json",
    }),
    body: () => "",
  }
};

const Profile = ({ setPrivGames, privGames }) => {
  const classes = useStyles();
  let history = useHistory();
  let textInput = useRef(null);
  const stripe = useStripe();
  const elements = useElements();


  const [dialog, toggleDialog] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [viewState, setViewState] = useState("loading");
  const [values, setValues] = useState({
    id: "",
    name: "",
    email: "",
    imageUrl: "",
  });

  // Save default name in separate variable, as the values["name"] variable can be dynamically edited
  const [savedName, setSavedName] = useState("");

  // Handle disabling of name field
  const [editState, setEditState] = useState(false);

  const logout = useCallback(() => {
    axios
      .get("/logout")
      .then((res) => {})
      .catch((err) => {})
      .finally(() => history.push("/login"));
  }, [history]);

  const editName = () => {
    // Button is pressed while editing name field
    if (editState) {
      handleSubmitName();
    } else {
      // Button is pressed while name field is disabled
      setTimeout(() => {
        textInput.current.focus();
      }, 100);
    }

    setEditState(!editState);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      setEditState(false);
      setValues({
        id: values["id"],
        name: savedName,
        email: values["email"],
        imageUrl: values["imageUrl"],
      });
    } else if (e.key === "Enter" || e.key === "NumpadEnter") {
      setEditState(false);
      handleSubmitName();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmitName = (e) => {
    if (savedName !== values["name"]) {
      axios
        .post("/account/update", values)
        .then((res) => {
          setSavedName(values["name"]);
        })
        .catch((err) => {});
    }
  };

  const submit = async () => {
    try {
      const data = {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      };
      const res = await stripe.confirmCardPayment(clientSecret, data);

      if (res.error) {
        throw new Error("Payment failed");
      } else if (res.paymentIntent?.status !== "succeeded") {
        if (process.env.NODE_ENV !== "production") {
          console.log(res);
        }
      }
      setViewState("success");
      setPrivGames(true);
      if (process.env.NODE_ENV !== "production") {
        console.log(`Transaction succeeded: ${res.paymentIntent.id}`);
      }
    } catch(err) {
      if (process.env.NODE_ENV !== "production") {
        console.log(err);
      }
      setViewState("error");
    }
  };

  useEffect(() => {
    // Get account information from database
    axios
      .get("/account")
      .then((res) => {
        setValues({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          imageUrl: res.data.imageUrl,
        });

        setSavedName(res.data.name);
      })
      .catch((err) => {
        logout();
      });
  }, [logout]);

  useEffect(() => {
    // create payment intent on page load
    const createPaymentIntent = async () => {
      try {
        const res = await fetch(api["createIntent"].url(values.name), {
          method: api["createIntent"].method(),
          headers: api["createIntent"].headers(),
        });
        const { type, ...response } = await res.json();
        switch(type) {
        case "finished":
          if (process.env.NODE_ENV !== "production") {
            console.log("User already paid");
          }
          setViewState("success");
          break ;
        case "success":
          setClientSecret(response.secret);
          setViewState("pay");
          if (process.env.NODE_ENV !== "production") {
            console.log("Created secret ", response.secret);
          }
          break ;
        case "error":
        default:
          if (process.env.NODE_ENV !== "production") {
            console.log("Error retrieving intent:", response);
          }
          break ;
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.log(err);
        }
        setViewState("error");
      }
    };

    if (values.name !== "" && clientSecret === "" && viewState !== "success") {
      createPaymentIntent();
    }
  }, [values.name, viewState, clientSecret]);

  return (
    <Container component="main" maxWidth="xs">
      <Upgrade
        submit={submit}
        setPrivGames={setPrivGames}
        viewState={viewState}
        toggle={dialog}
        toggleDialog={toggleDialog}/>
      <div className={classes.root}>
        <>
          {values["email"] !== "" ? (
            <>
              <Typography variant="h5">Profile</Typography>
              <hr className={classes.underline} />
              <form className={classes.form}>
                <Typography variant="subtitle1">Name:</Typography>
                <TextField
                  id="name"
                  name="name"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={values["name"]}
                  inputRef={textInput}
                  disabled={!editState}
                  onKeyDown={handleKeyPress}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.editButton}
                        onClick={editName}
                      >
                        {editState ? <SendIcon /> : <EditIcon />}
                      </Button>
                    ),
                  }}
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
                <Container align="center">
                  {
                    (() => {
                      if (privGames) {
                        return (
                          <Typography className={classes.paid}>
                            Membership Type: Full
                          </Typography>
                        )
                      }
                      switch (viewState) {
                      case "loading":
                        return <CircularProgress/>;
                      case "error":
                      case "pay":
                        return (
                          <Button
                            onClick={() => toggleDialog(old => !old)}
                            variant="contained"
                            color="secondary"
                            className={classes.upgradeButton}>
                            Upgrade Now!
                          </Button>
                        );
                      default:
                        if (process.env.NODE_ENV !== "production") {
                          console.log(`Unknown viewState: ${viewState}`);
                        }
                        return <div></div>;
                      }
                    })()
                  }
                </Container>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.formButton}
                  onClick={logout}>
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

Profile.propTypes = {
  setPrivGames: PropTypes.func.isRequired,
  privGames: PropTypes.bool.isRequired,
};

export default Profile;
