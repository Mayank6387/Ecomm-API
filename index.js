const express=require('express')
const app= express();
const dotenv=require('dotenv')
dotenv.config();
const connectDB = require('./config/mongooseConnection');
connectDB();
const cors=require('cors')
const authRouter = require('./Routes/authRoute');
const userRouter=require('./Routes/userRoutes');
const productsRouter=require('./Routes/productRoute');
const cartRouter = require('./Routes/cartRoute');
const orderRouter=require('./Routes/orderRoute');
const paymentRouter = require('./Routes/paymentRoute');

app.use(express.json())
app.use(cors())
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/products',productsRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/checkout',paymentRouter)


app.listen(process.env.PORT ||5000,()=>{
    console.log("Server is running")
})