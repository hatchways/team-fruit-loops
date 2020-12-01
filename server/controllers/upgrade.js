const stripeConfig = require("stripe");

const User = require("../models/User");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (stripeSecretKey === "") {
  console.log("Error: Stripe secret key not found: exiting.");
  process.exit(1);
}

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

if (endpointSecret === "") {
  console.log("Warning: Stripe endpoint secret not set.");
}

const stripe = stripeConfig(stripeSecretKey);

const intent = async (req, res) => {
  try {
    const player = await User.findOne({ name: req.params.player }).exec();
    if (player.account.privateGames === true) {
      const body = { error: "Error: ${player.name} already paid", paid: true, };
      res.status(409).send(body);
    } else if (player.account.paymentSecret === undefined) {
      const intent = { amount: 500, currency: "usd" };
      const paymentIntent = await stripe.paymentIntents.create(intent);
      player.account.paymentID = paymentIntent.id;
      player.account.paymentSecret = paymentIntent.client_secret;
      await player.save();
      console.log(`Created ${player.name} payment intent: ${paymentIntent.id}`);
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
  case "charge.succeeded":
  case "payment_intent.succeeded":
    const intent = event.data.object.payment_intent;
    try {
      const player = await User.findOne({ "account.paymentID": intent }).exec();

      if (player === null) {
        throw new Error(`Player containing ${intent} not found`);
      } else if (player.account.privateGames === false) {
        player.account.privateGames = true;
        player.account.paymentSecret = undefined;
        await player.save();
      }
      console.log(`Payment Intent ${intent} was saved`);
    } catch (err) {
      console.log(`Webhook Error updating player intent ${intent}: ${err}`);
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
