import React, { useState, useEffect, } from "react";
import { Redirect, useParams, } from "react-router-dom";
import {
 CardElement,
 Elements,
 useElements,
 useStripe,
} from '@stripe/react-stripe-js';
import {
  CircularProgress,
  Container,
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

const CheckoutForm = ({ classes, player }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [viewState, setViewState] = useState("loading");

  const handleSubmit = async e => {
    e.preventDefault();
    if (clientSecret === "") {
      return ;
    }

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
      if (process.env.NODE_ENV !== "production") {
        console.log(`Transaction succeeded: ${res.paymentIntent.id}`);
      }
      setViewState("success");
    } catch(err) {
      if (process.env.NODE_ENV !== "production") {
        console.log(err);
      }
      setViewState("error");
    }
  }

  // create payment intent on page load
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch(api["createIntent"].url(player), {
          method: api["createIntent"].method(),
          headers: api["createIntent"].headers(),
        });
        const { secret, error, paid } = await res.json();
        switch (true) {
        case paid === true:
          setViewState("success");
          break ;
        case error !== undefined:
          if (process.env.NODE_ENV !== "production") {
            console.log(`Error retrieving intent client secret: ${error.message}`);
          }
          break ;
        default:
          setClientSecret(secret);
          setViewState("pay");
          if (process.env.NODE_ENV !== "production") {
            console.log("Created secret ", secret);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.log(err);
        }
        setViewState("error");
      }
    };

    createPaymentIntent();
  }, [player]);

  switch (viewState) {
  default:
  case "error":
    return (
      <Container align="center">
        <Typography textAlign="center">
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
        <CircularProgress className={viewState === "loading" ? null : classes.hidden}/>
        <div className={viewState === "pay" ? null : classes.hidden}>
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

const UpgradeComponent = ({ classes, publishableKey, ...props}) => {
  const { player } = useParams()
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
        <CheckoutForm player={player} classes={classes}/>
      </Elements>
    </div>
  );
};

const Upgrade = withStyles(styles)(UpgradeComponent);

export default Upgrade;
