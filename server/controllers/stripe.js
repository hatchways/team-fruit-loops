const stripeConfig = require("stripe");

const User = require("../models/User");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (stripeSecretKey === "") {
  console.log("Error: Stripe secret key not found: exiting.");
  process.exit(1);
}

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
if (endpointSecret === "") {
  console.log("Warning: STRIPE_ENDPOINT_SECRET not set, cannot verify signatures.");
}

const stripe = stripeConfig(stripeSecretKey);

const monthAbbrevs = [
  "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const milliSecondsinSeconds = 1000;

const createPaymentIntent = async (user, res) => {
  const intent = { amount: 500, currency: "usd" };
  const paymentIntent = await stripe.paymentIntents.create(intent);
  user.account.privateGames.payment.piID = paymentIntent.id;
  user.account.privateGames.payment.piSecret = paymentIntent.client_secret;

  try {
    await user.save();
    console.log(`Created ${user.name} payment intent: ${paymentIntent.id}`);
    return res.status(201).send({
      type: "success",
      intent: user.account.privateGames.payment.piSecret,
    });
  } catch(err) {
    console.log(`Error creating payment intent: ${err}`);
    return res.status(500).send({ error: "Error processing payment" });
  }
};

const intent = async (req, res) => {
  const user = res.locals.user;

  if (user.account.privateGames.payment.piSecret === undefined) {
    return createPaymentIntent(user, res);
  } else if (user.account.privateGames.enabled === false) {
    return res.status(409).send({
      type: "success",
      intent: user.account.privateGames.payment.piSecret,
    });
  }
  const date = user.account.privateGames.payment.date;
  return res.status(409).send({
    text: `Member since ${monthAbbrevs[date.getMonth()]} ${date.getFullYear()}`,
    type: "finished",
    intent: user.account.privateGames.payment.piSecret,
  });
};

const privateGamesEnabled = async (req, res, next) => {
  const user = res.locals.user;

  if (user.account.privateGames.enabled) {
    return res.send({ enabled: true });
  }
  return res.status(400).json({ error: `${user.name} has not upgraded ` });
};

// listen for stripe & process compeleted payments
const webhook = async (req, res) => {
  let event;

  try {
    switch (true) {
    case process.env.NODE_ENV === "production" && endpointSecret !== "":
      event = stripe.webhooks.constructEvent(
          request.body,
          req.headers["stripe-signature"],
          endpointSecret
        );
      break ;
    case process.env.NODE_ENV === "production" && endpointSecret === "":
    case process.env.NODE_ENV !== "production":
      event = req.body;
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
      const user = await User
        .findOne({ "account.privateGames.payment.piID": intent.id })
        .exec();

      if (user === null) {
        throw new Error(`Player containing ${intent.id} not found`);
      } else if (user.account.privateGames.enabled === false) {
        user.account.privateGames.enabled = true;
        const epochTime = intent.created * milliSecondsinSeconds;
        user.account.privateGames.payment.date = Date(epochTime);
        await user.save();
      }
      console.log(`Payment Intent ${intent.id} was saved`);
    } catch (err) {
      console.log(`Webhook Error updating player intent ${intent.id}: ${err}`);
    }
    break ;
  default:
    console.log(`Webhook - Unhandled event type: ${event.type}`);
  }
}

module.exports = {
  intent,
  privateGamesEnabled,
  webhook,
}
