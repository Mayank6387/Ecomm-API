const express = require("express");
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
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


userRouter.delete("/:id",verifyTokenAndAuth,async(req,res)=>{
  try{
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted")
  }catch(err){
    res.status(500).json(err)
  }
})

userRouter.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
  try{
    const user=await userModel.findById(req.params.id);
    const {password,...others}=user._doc;
    res.status(200).json(others)
  }catch(err){
    res.status(500).json(err)
  }
})

userRouter.get("/",verifyTokenAndAdmin,async(req,res)=>{
  const query=req.query.new;
  try{
    const users=query?await userModel.find().sort({_id:-1}).limit(5):await userModel.find();
    res.status(200).json(users);
  }catch(err){
    res.status(500).json(err);
  }
})


userRouter.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
  const date=new Date();
  const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
  try{
    const data=await userModel.aggregate([
      {$match:{createdAt:{$gte:lastYear}}},
      {$project:{month:{$month:"$createdAt"}}},
      {$group:{_id:"$month", total:{$sum:1}}}
     ])
     res.status(200).json(data)
  }catch(err){
    res.status(500).json(err);
  }
})

module.exports = userRouter;
