const express = require("express");
const productModel = require("../models/productsSchema");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const productsRouter = express.Router();

productsRouter.post("/create", async (req, res) => {
  const newProduct = new productModel(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

productsRouter.put(
  "/update/:id",
  verifyTokenAndAdmin,
  async (req, res) => {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

productsRouter.delete("/delete/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been Deleted")
    }catch(err){
        res.status(500).json(err);
    }
})

productsRouter.get("/get/:id",async(req,res)=>{
    try{
        const products=await productModel.findById(req.params.id)
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err)
    }
})

productsRouter.get("/get",async(req,res)=>{
    const qnew=req.query.new       //http://localhost:3000/api/products/get/?new=true
    const qcategory=req.query.category  //http://localhost:3000/api/products/get/?category=men
    try{
        let products;
        if(qnew){
            products=await productModel.find().sort({createdAt:-1}).limit(5);
        }else if(qcategory){
            products=await productModel.find({
                categories:{
                    $in:[qcategory]
                }
            })
        }else{
            products=await productModel.find();
        }
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = productsRouter;
