const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./Config");
const morgan =require("morgan")
const stripe = require("stripe")(config.SecretKey);

const options = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Middlewares
app.use(cors(options));
app.use(express.json());
app.use(morgan("tiny"))

app.post("/create-payment-key", async (req, res) => {
  const { amount, email } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: email,
    });
    res.status(200).send({ client_secrect: paymentIntent?.client_secret });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Port, listen for the requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
