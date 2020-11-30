import React, { cloneElement, useState, useEffect, } from "react";
import { Redirect, } from "react-router-dom";
import {
 CardElement,
 Elements,
 useElements,
 useStripe,
} from '@stripe/react-stripe-js';
import {
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';

const stripePubKey = process.env.REACT_APP_STRIPE_PUB_KEY;

if (stripePubKey === "") {
  console.log("Error: expected stripe publishable key");
}

const styles = theme => ({
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
});

const CheckoutForm = ({ classes, secret, setViewState }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const data = {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      };
      setViewState("loading");
      const res = await stripe.confirmCardPayment(secret, data);

      if (res.error) {
        throw new Error(`Payment failed: ${res.error.message}`);
      } else if (res.paymentIntent?.status !== "succeeded") {
        if (process.env.NODE_ENV !== "production") {
          console.log(res);
        }
        throw new Error("Payment failed");
      }
      if (process.env.NODE_ENV !== "production") {
        console.log(`Transaction succeeded: ${res.paymentIntent.id}`);
      }
      setViewState("paid");
    } catch(err) {
      if (process.env.NODE_ENV !== "production") {
        console.log(err);
      }
      setViewState("error");
    }
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <CardElement/>
      <Button onClick={handleSubmit}>Pay</Button>
    </form>
  );
};

const api = {
  "createIntent": {
    url: player => `/stripe/${player}/intent`,
    method: () => "GET",
    headers: () => ({
      Accept: "application/json",
    }),
    body: () => "",
  }
};

const StripeWrapper = ({ classes, pubKey, children, player }) => {
  const [viewState, setViewState] = useState("loading");
  const [secret, setSecret] = useState("");

  // create payment intent on page load
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch(api["createIntent"].url(player), {
          method: api["createIntent"].method(),
          headers: api["createIntent"].headers(),
        });

        if (res.status === 409) {
          setViewState("paid");
          return ;
        }

        const { secret, error } = await res.json();
        if (error) {
          if (process.env.NODE_ENV !== "production") {
            console.log(`Error retrieving intent client secret: ${error.message}`);
          }
          setViewState("error");
          return ;
        }
        if (process.env.NODE_ENV !== "production") {
          console.log("Created secret ", secret);
        }
        setSecret(secret);
        setViewState("intent");
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.log(err);
        }
        setViewState("error");
      }
    };

    createPaymentIntent();
  }, [player]);

  switch(viewState) {
  case "error":
    return (
      <Typography>
        Error processing payment: please try another method
      </Typography>
    );
  case "paid":
    return (
      <Typography>Payment Accepted: Enjoy</Typography>
    );
  case "loading":
    return (
      <CircularProgress />
    );
  case "intent":
    const Child = cloneElement(children, { secret, setViewState });
    return (
      <Elements stripe={loadStripe(pubKey)}>
        <Child />
      </Elements>
    );
  default: {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Error: Unknown status: ${viewState}`);
    }
  }
  }
};

StripeWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  pubKey: PropTypes.string.isRequired,
  player: PropTypes.string.isRequired,
};

const UpgradePage = ({ classes, player }) => {
  if (stripePubKey === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      console.log("Error: Stripe key not found, redirecting");
    }
    return <Redirect to="/profile" />
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5">
        Upgrade Account
      </Typography>
      <hr className={classes.underline} />
      <StripeWrapper pubKey={stripePubKey}>
        <CheckoutForm player={player} classes={classes}/>
      </StripeWrapper>
    </div>
  );
};

UpgradePage.propTypes = {
  classes: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
};


const Upgrade = withStyles(styles)(UpgradePage);

export default Upgrade;
