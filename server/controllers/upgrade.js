const stripeConfig = require("stripe");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (stripeSecretKey === "") {
  console.log("Error: Stripe secret key not found: exiting.");
  process.exit(1);
}

const stripe = stripeConfig(stripeSecretKey);

const createPaymentIntent = async (req, res) => {
  let paymentIntent;
  try {
    const intent = { amount: 500, currency: "usd" };
    paymentIntent = await stripe.paymentIntents.create(intent);
  } catch (err) {
    console.log(`Error creating payment intent: ${err}`, err);
    res.status(500).send({ error: "Error processing payment" });
    return ;
  }

  // send publishable key and PaymentIntent details to client
  const browserIntent = {
    client_secret: paymentIntent.client_secret,
  };
  res.status(201).send(browserIntent);
  console.log(`Created client secret: ${browserIntent.clientSecret}`);
}

module.exports = {
  createPaymentIntent,
}
