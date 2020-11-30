const stripeConfig = require("stripe");

const User = require("../models/User");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (stripeSecretKey === "") {
  console.log("Error: Stripe secret key not found: exiting.");
  process.exit(1);
}

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

if (endpointSecret === "") {
  console.log("Warning: Stripe endpoint secret (\"'payment_intent.succeeded'\") not set.");
}

const stripe = stripeConfig(stripeSecretKey);

const intent = async (req, res) => {
  try {
    const player = await User.findOne({ name: req.params.player }).exec();
    if (player.account.membership === "full") {
      res.status(409).send({ error: "Error: ${player.name} already paid" });
    } else if (player.account.paymentIntent === undefined) {
      const intent = { amount: 500, currency: "usd" };
      const paymentIntent = await stripe.paymentIntents.create(intent);
      player.account.paymentID = paymentIntent.id;
      player.account.paymentSecret = paymentIntent.client_secret;
      await player.save();
      if (process.env.NODE_ENV !== "production") {
        console.log(`Created client secret: ${paymentIntent.client_secret}`);
      }
      res.status(201).send({ secret: player.account.paymentSecret, });
    } else {
      res.status(409).send({ secret: player.account.paymentSecret, });
    }
  } catch(err) {
    console.log(`Error creating payment intent: ${err}`);
    res.status(500).send({ error: "Error processing payment" });
  }
};

// listen for stripe & process compeleted payments
const webhook = async (req, res) => {
  let event;

  try {
    if (process.env.NODE_ENV !== "production") {
      event = req.body;
    }
    if (process.env.NODE_ENV === "production") {
      event = stripe.webhooks.constructEvent(
        request.body,
        req.headers["stripe-signature"],
        endpointSecret
      );
    }
    res.send({ received: true });
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return ;
  }

  switch (event.type) {
  case "payment_intent.succeeded":
    const intent = event.data.object;
    try {
      const player = await User.findOne({ "account.paymentID": intent.id }).exec();

      if (player === null) {
        throw new Error(`Player containing ${intent.id} not found`);
      }
      player.account.privateGames = true;
      player.account.paymentSecret = undefined;
      await player.save();
      console.log("Payment Intent ${intent.id)} was saved");
    } catch (err) {
      console.log(`Webhook Error updating player charge: intent=${intent} err${err}`);
    }
    break ;
  default:
    console.log(`Webhook - Unhandled event type: ${event.type}`);
  }
}

module.exports = {
  intent,
  webhook,
}
