import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
 CardElement,
 Elements,
 useElements,
 useStripe,
} from '@stripe/react-stripe-js';
import {
  Button,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { loadStripe } from '@stripe/stripe-js';

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

const api = {
  "createIntent": {
    url: () => "/upgrade/create-intent",
    method: () => "GET",
    headers: () => ({
      Accept: "application/json",
    }),
    body: () => "",
  }
};

const CheckoutForm = ({ classes }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (clientSecret === "") {
      return ;
    }

    try {
      const paymentData = {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      };
      const res = await stripe.confirmCardPayment(clientSecret, paymentData);

      if (res.error) {
        throw new Error(`Payment failed`);
      } else if (res.paymentIntent?.status !== "succeeded") {
        if (process.env.NODE_ENV !== "production") {
          console.log(res);
        }
      }
      if (process.env.NODE_ENV !== "production") {
        console.log(`Transaction succeeded: ${res}`, res);
      }
    } catch(err) {
      if (process.env.NODE_ENV !== "production") {
        console.log(err);
      }
    }
  }

  // create payment intent on page load
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch(api["createIntent"].url(), {
          method: api["createIntent"].method(),
          headers: api["createIntent"].headers(),
        });
        const { client_secret: secret, err } = await res.json();
        if (err) {
          if (process.env.NODE_ENV !== "production") {
            console.log(err);
          }
          return ;
        }
        setClientSecret(secret);
        if (process.env.NODE_ENV !== "production") {
          console.log("Created secret ", secret, clientSecret);
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.log(err);
        }
      }
    };

    createPaymentIntent();
  }, []);

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <CardElement/>
      <Button onClick={handleSubmit}>Pay</Button>
    </form>
  );
};

const UpgradePage = ({ classes, publishableKey, ...props}) => {
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
      <Elements stripe={loadStripe(stripePubKey)}>
        <CheckoutForm classes={classes}/>
      </Elements>
    </div>
  );
};

const Upgrade = withStyles(styles)(UpgradePage);

export default Upgrade;
