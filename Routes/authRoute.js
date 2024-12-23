const express=require('express')
const authRouter=express.Router();
const userModel=require('../models/userSchema')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

authRouter.post('/register',async(req,res)=>{
    const {username,email,password}=req.body;

    if(!username || !password || !email){
        res.status(500).json({error:"Please enter all details"})
    }
    let salt=await bcrypt.genSalt(10)
    let hashPassword=await bcrypt.hash(password,salt)
    const newUser=new userModel({
        username,
        email,
        password:hashPassword 
    })

    try{
        const savedUser=await newUser.save();
        var token=jwt.sign({id:newUser._id, isAdmin:newUser.isAdmin},
            process.env.SECRET_KEY,
            {expiresIn:"3d"})
        res.status(201).json(savedUser);

    }catch(err){
        res.status(500).json(err)
    }
})


authRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(500).json({error:"Please enter all details"})
    }
    try{
        const user=await userModel.findOne({email:email})
        if(!user){
            res.status(500).json({error:"User not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            res.status(500).json({error:"Invalid credentials"})
        }
        var token=jwt.sign({id:user._id, isAdmin:user.isAdmin},
            process.env.SECRET_KEY,
            {expiresIn:"3d"})

        res.status(200).json({message:"Login successful",
            user,
            accessToken:token
        })

    }catch(err){
        res.status(500).json(err)
    }
})
module.exports=authRouter