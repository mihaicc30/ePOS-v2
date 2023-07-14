require("dotenv").config();
const router = require("express").Router();
const stripe = require("stripe")(process.env.S_SK);

router.post("/create-payment-intent", async (req, res) => {
  const { amount, paymentMethod, v } = req.body;
  console.log(v);
  if (process.env.v !== v) {
    res.status(403).send();
    return;
  }
  if (!amount) return;
  if (!paymentMethod || !amount) {
    res.json({
      status: false,
    });
    return;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "gbp",
    payment_method: paymentMethod.id,
    payment_method_types: ["card"],
  });

  res.json({
    client_Secret: paymentIntent.client_secret,
    status: true,
  });
});

router.get("/create-payment-intent-config", (req, res) => {
  console.log("Requesting config", process.env.S_PK);
  res.json({
    publishableKey: process.env.S_PK,
  });
});

router.post("/create-payment-intent2", async (req, res) => {
  console.log("Requesting payment intent.");

  if (req.body?.v !== process.env.v) {
    console.log(1);
    res.status(403).json({ err: "key not valid" });
    return;
  } else if (!req.body) {
    console.log(2);
    res.status(403).json({ err: "body is not existant" });
    return;
  }
  const amountInPounds = req.body.amount;
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  const formattedAmount = formatter.formatToParts(amountInPounds);

  let pennies = 0;
  for (const part of formattedAmount) {
    if (part.type === "integer" || part.type === "fraction") {
      pennies = pennies * 100 + parseInt(part.value, 10);
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: pennies,
    currency: "gbp",
    automatic_payment_methods: { enabled: true },
  });
  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

router.post("/create-payment-intent3", async (req, res) => {
  console.log("Requesting payment intent.", new Date());

  if (req.body?.v !== process.env.v) {
    console.log(1);
    res.status(403).json({ err: "key not valid" });
    return;
  } else if (!req.body) {
    console.log(2);
    res.status(403).json({ err: "body is not existant" });
    return;
  } else if (req.body.amount <= 0.3) {
    console.log(3);
    res.status(403).json({ err: "Basket is empty." });
    return;
  }
  const amountInPounds = req.body.amount;
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  const formattedAmount = formatter.formatToParts(amountInPounds);

  let pennies = 0;
  for (const part of formattedAmount) {
    if (part.type === "integer" || part.type === "fraction") {
      pennies = pennies * 100 + parseInt(part.value, 10);
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: pennies,
    currency: 'gbp',
    payment_method: 'pm_card_visa',
  });

  console.log(paymentIntent.client_secret);
  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = router;
