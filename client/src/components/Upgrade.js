import React from "react";
import {
 CardElement,
} from '@stripe/react-stripe-js';
import {
  Button,
  CircularProgress,
  Container,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  underline: {
    width: "50px",
    height: "1px",
    color: "black",
    // backgroundColor: "#32BE72",
  },
  form: {
    marginTop: theme.spacing(1),
    width: "100%",
  },
  hidden: {
    display: "none",
  },
  pay: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "block",
    backgroundColor: "rgb(38, 182, 92)",
    color: "white",
    width: "30%",
    height: "40px",
  },
  error: {
    color: "red",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
});

const CheckoutForm = ({ classes, ...props }) => {
  const handleSubmit = async e => {
    e.preventDefault();
    if (props.clientSecret === "") {
      return ;
    }
    props.submit();
  }

  switch (props.viewState) {
  default:
    console.log(`Unknown viewState: ${props.viewState}`);
    return <div/>;
  case "success":
    return (
      <Container align="center">
        <Typography>
          Payment Successful. Enjoy your private games!
        </Typography>
      </Container>
    );
  case "loading":
  case "error":
  case "pay":
    return (
      <Container align="center">
        <CircularProgress className={
          props.viewState === "loading" ? null : classes.hidden
        }/>
        <div className={props.viewState !== "loading" ? null : classes.hidden}>
          {
            props.viewState === "error" && (
              <Typography className={classes.error}>
                Error submitting payment: please try another method
              </Typography>
            )
          }
          <form className={classes.form} onSubmit={handleSubmit}>
            <CardElement/>
            <Button
              className={classes.pay}
              variant="outlined"
              onClick={handleSubmit}>
              Pay
            </Button>
          </form>
        </div>
      </Container>
    );
  }
};

CheckoutForm.propTypes = {
  classes: PropTypes.object.isRequired,
  viewState: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
};

const UpgradeComponent = ({ classes, ...props }) => {
  const onBackdropClick = e => {
    e.preventDefault();
    props.toggleDialog(false);
  };

  return (
    <Dialog
      keepMounted
      onBackdropClick={onBackdropClick}
      open={props.toggle}
      fullWidth={true}
      maxWidth="md">
      <DialogTitle>
        <Typography align="center">
          Upgrade Now!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText align="center">
          Upgrade from a basic account for a one-time charge of $5.00
          to be able to create and play private games with friends.
        </DialogContentText>
        {
          props.viewState === "loading"
            ? <CircularProgress/>
            : (
              <div className={classes.root}>
                <hr className={classes.underline}/>
                <CheckoutForm classes={classes} { ...props }/>
              </div>
            )
        }
      </DialogContent>
    </Dialog>
  );
}

UpgradeComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  setPrivGames: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  viewState: PropTypes.string.isRequired,
};

const Upgrade = withStyles(styles)(UpgradeComponent);

export default Upgrade;
