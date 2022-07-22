const express = require('express')
const router = new express.Router()
const User=require('../model/user')


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
 






module.exports=router