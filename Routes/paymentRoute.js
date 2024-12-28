const express = require('express');
const paymentRouter = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

paymentRouter.post("/payments", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "inr",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});


module.exports=paymentRouter