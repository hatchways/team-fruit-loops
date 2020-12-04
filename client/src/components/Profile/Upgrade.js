import React, { forwardRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Container,
  CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  IconButton,
  Slide,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';

import useFetchPaymentIntent from "./upgradeApi";

const upgradeStyles = theme => ({
  form: {
    width: "80%",
  },
  pay: {
    marginBottom: theme.spacing(2),
    display: "block",
    backgroundColor: "rgb(38, 182, 92)",
    color: "white",
    width: "30%",
    height: "40px",
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  close: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(2),
  },
  spacer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    height: "40px",
  },
});

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpgradeComponent = ({ classes, open, close, intent, onSuccess, onError, }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (intent === "") {
      return ;
    }

    try {
      const res = await stripe.confirmCardPayment(intent, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (res.error) {
        throw new Error("Payment failed");
      } else if (res.paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch(err) {
      if (process.env.NODE_ENV !== "production") {
        console.log(err);
      }
      onError();
    }
      close();
  };

  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      maxWidth="md"
      fullWidth={true}
      onBackdropClick={close}
      open={open}>

      <DialogTitle disableTypography={true}>
        <Typography align="center" className={classes.title}>
          Upgrade Now!
        </Typography>
        <IconButton
          className={classes.close}
          onClick={close}>
          <CloseIcon/>
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Container align="center">
          <DialogContentText>
            Upgrade from a basic account for a one-time charge of $5.00
            to be able to create and play private games with friends.
          </DialogContentText>
          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.spacer}>
              <CardElement/>
            </div>
            <Button
              variant="contained"
              onClick={handleSubmit}
              className={classes.pay}>
              Pay
            </Button>
          </form>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

UpgradeComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  intent: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

const Upgrade = withStyles(upgradeStyles)(UpgradeComponent);

const upgradeButtonStyles = theme => ({
  upgradeButton: {
    backgroundColor: "rgb(38, 182, 92)",
    width: "120px",
    height: "40px",
  },
});

const UpgradeButtonComponent = ({ classes, upgradeClose, view, text }) => {
  switch (view) {
  case undefined:
    return <div></div>;
  case "loading":
    return (
      <div>
        <CircularProgress/>
      </div>
    );
  case "finished":
  case "paid":
    return (
      <Button className={classes.paid} variant="outlined">
        { text === "" ? "Payment Successful!" : text }
      </Button>
    );
  case "error":
  case "pay":
  default:
    const onClick = view === "pay" ? upgradeClose : undefined;
    return (
      <Button
        disabled={view === "error"}
        variant="contained"
        className={classes.upgradeButton}
        onClick={onClick}>
        {
          view === "error"
            ? "Error in payments. Please try again later"
            : "Upgrade Now!"
        }
      </Button>
    );
  }
};

UpgradeButtonComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  upgradeClose: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

const UpgradeButton = withStyles(upgradeButtonStyles)(UpgradeButtonComponent);

export {
  Upgrade,
  UpgradeButton,
  useFetchPaymentIntent,
};
