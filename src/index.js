const express= require('express')
require('./db/mongoose')
const userRouter=require('./routers/user')
const couponRouter=require('./routers/coupon')


const app=express()
const port=3000

app.use(express.json())

//Registring Routers
app.use(userRouter)
app.use(couponRouter)

app.listen(process.env.PORT,()=>{
    console.log("Server is running successfully on port" +process.env.PORT)
})
