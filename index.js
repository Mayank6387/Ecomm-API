const express=require('express')
const app= express();
const dotenv=require('dotenv')
dotenv.config();
const connectDB = require('./config/mongooseConnection');
connectDB();
const authRouter = require('./Routes/authRoute');
const userRouter=require('./Routes/userRoutes');
const productsRouter=require('./Routes/productRoute');
const cartRouter = require('./Routes/cartRoute');
const orderRouter=require('./Routes/orderRoute')

app.use(express.json())

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/products',productsRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)



app.listen(process.env.PORT ||5000,()=>{
    console.log("Server is running")
})