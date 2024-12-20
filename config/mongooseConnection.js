const mongoose=require('mongoose')

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB connected")
})
.catch((err)=>{
    console.log("Error in connecting DB",err)
})
}

module.exports=connectDB;
