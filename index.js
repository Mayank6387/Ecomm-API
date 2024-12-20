const express=require('express')
const app= express();
const dotenv=require('dotenv')
dotenv.config();
const connectDB = require('./config/mongooseConnection');
connectDB();
const userRouter=require('./Routes/userRoutes')

app.use(express.json())


app.use('/api/users',userRouter)



app.listen(process.env.PORT ||5000,()=>{
    console.log("Server is running")
})