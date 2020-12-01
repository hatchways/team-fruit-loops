import React from "react";
import {
 CardElement,
 Elements,
 useElements,
 useStripe,
} from '@stripe/react-stripe-js';
import {
  Button,
  CircularProgress,
  Container,
  Dialog, DialogTitle, DialogContent,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(8),
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
    visibility: "collapse",
  },
  pay: {
    marginTop: theme.spacing(1),
    display: "block",
    backgroundColor: "rgb(38, 182, 92)",
    color: "white",
    width: "30%",
  },
});

const CheckoutForm = ({ classes, ...props }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async e => {
    e.preventDefault();
    if (props.clientSecret === "") {
      return ;
    }

    try {
      const data = {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      };
      const res = await stripe.confirmCardPayment(props.clientSecret, data);

      if (res.error) {
        throw new Error("Payment failed");
      } else if (res.paymentIntent?.status !== "succeeded") {
        if (process.env.NODE_ENV !== "production") {
          console.log(res);
        }
      }
      if (process.env.NODE_ENV !== "production") {
        console.log(`Transaction succeeded: ${res.paymentIntent.id}`);
      }
      props.setViewState("success");
      props.setPrivGames(true);
    } catch(err) {
      if (process.env.NODE_ENV !== "production") {
        console.log(err);
      }
      props.setViewState("error");
    }
  }

  switch (props.viewState) {
  default:
  case "error":
    return (
      <Container align="center">
        <Typography>
          Error in payment: please try another method
        </Typography>
      </Container>
    );
  case "success":
    return (
      <Container align="center">
        <Typography>
          Payment Successful. Enjoy your private games!
        </Typography>
      </Container>
    );
  case "loading":
  case "pay":
    return (
      <Container align="center">
        <CircularProgress className={
          props.viewState === "loading" ? null : classes.hidden
        }/>
        <div className={props.viewState === "pay" ? null : classes.hidden}>
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
  clientSecret: PropTypes.string.isRequired,
  viewState: PropTypes.string.isRequired,
  setViewState: PropTypes.func.isRequired,
  setPrivGames: PropTypes.func.isRequired,
  toggleDialog: PropTypes.func.isRequired,
};

const UpgradeComponent = ({ classes, ...props }) => {
  if (props.stripePubKey === undefined || props.name === "") {
    return <div/>
  }

  return (
    <Dialog
      onBackdropClick={() => props.toggleDialog(false)}
      open={props.toggle}
      fullWidth={true}
      maxWidth="md">
      <DialogTitle></DialogTitle>
      <DialogContent>
      {
        props.viewState === "loading"
          ? <CircularProgress/>
          : (
            <div className={classes.root}>
              <hr className={classes.underline}/>
              <Elements stripe={loadStripe(props.stripePubKey)}>
                <CheckoutForm
                  toggleDialog={props.toggleDialog}
                  setPrivGames={props.setPrivGames}
                  setViewState={props.setViewState}
                  viewState={props.viewState}
                  classes={classes}
                  clientSecret={props.clientSecret}/>
              </Elements>
            </div>
          )
      }
      </DialogContent>
    </Dialog>
  );
};

UpgradeComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  stripePubKey: PropTypes.string.isRequired,
  clientSecret: PropTypes.string.isRequired,
  viewState: PropTypes.string.isRequired,
  setViewState: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  setPrivGames: PropTypes.func.isRequired,
};

const Upgrade = withStyles(styles)(UpgradeComponent);

export default Upgrade;
