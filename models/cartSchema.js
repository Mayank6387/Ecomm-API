const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema(
    {
        userId:{type:String, required:true},
        products:[
            {
                productsId:{
                    type:String,
                },
                quantity:{
                    type:Number,
                    default:1
                }
            }
        ]
    },{timestamps:true}
)

module.exports=mongoose.model("cart",cartSchema);