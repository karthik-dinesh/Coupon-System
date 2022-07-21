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

app.listen(port,()=>{
    console.log("Server is running successfully on port" +port)
})
