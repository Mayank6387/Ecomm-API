const express = require("express");
const { verifyTokenAndAuth } = require("../middlewares/verifyToken");
const userRouter = express.Router();
const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");

userRouter.put("/:id", verifyTokenAndAuth, async (req, res) => {
  if (req.body.password) {
    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
    {
        $set: req.body,
    },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = userRouter;
