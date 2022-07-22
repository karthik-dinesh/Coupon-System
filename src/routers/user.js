const express = require('express')
const router = new express.Router()
const User=require('../model/user')
const {auth} =require('../middleware/auth')


router.post('/user/register',async (req,res)=>{
    const user=new User(req.body)
    user.save().then(()=>{
        res.status(201).send(user)
    }).catch((e)=>{
        res.status(400).send('User already Exist!!')
    })
})

router.post('/user/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token =await user.generateAuthtoken()
        res.status(200).send({user,token})
    }
    catch(e){
       res.status(400).send('Failed to Login')
    }

})

router.post('/user/logout',auth,async(req,res)=>{
     try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send('User is LoggedOut Sucessfully')

     }catch(e){
        res.status(400).send('Failed to Logout')
     }
})
 






module.exports=router