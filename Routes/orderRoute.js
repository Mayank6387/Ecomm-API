const express = require("express");
const orderModel = require("../models/orderSchema");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
} = require("../middlewares/verifyToken");

const orderRouter = express.Router();

orderRouter.post("/create", verifyToken, async (req, res) => {
  const newOrder = new orderModel(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

orderRouter.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

orderRouter.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

orderRouter.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const order = await orderModel.findOne({ userId: req.params.userId });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

orderRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

orderRouter.get("/income", async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await orderModel.aggregate([
      { $match: { createdAt: { $gte: prevMonth } } },
      {
        $project: { month: { $month: "$createdAt" }, sales: "$amount" },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = orderRouter;
