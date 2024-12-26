const express = require("express");
const cartModel = require("../models/cartSchema");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const cartRouter = express.Router();

cartRouter.post("/create", verifyToken, async (req, res) => {
  const newCart = new cartModel(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

cartRouter.put("/update/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

cartRouter.delete("/delete/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await cartModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

cartRouter.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

cartRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = cartRouter;
