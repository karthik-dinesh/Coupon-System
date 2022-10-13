const express = require('express')
const router = new express.Router()
const Coupon=require('../model/coupon')
const sendmail=require('../email/mail')
const User=require('../model/user')
const {auth,isadmin} =require('../middleware/auth')


router.post('/create/coupon',auth,isadmin,(req,res)=>{
    const coupon=new Coupon(req.body)
    coupon.save().then(()=>{
        res.status(200).send(coupon)
    }).catch((e)=>{
        res.status(400).send('Coupon Already Exist!!')
    })

})


router.get('/getcoupon',auth,async(req,res)=>{
    try{
        const user =await User.VerifyUserRequest(req.user.email)
        const coupon =await Coupon.findOne({couponstatus:false})         
        if(response ===process.env.MAILSTATUS){
          const updatedcoupon =await Coupon.findByIdAndUpdate({_id:coupon._id},{couponstatus:true,couponowner:user._id},{new:true})
        res.status(200).json({
        couponcode:coupon.couponcode,
        secretKey:coupon.secretkey
        })
    }
    catch(e){   
      res.status(400).send('You have reached maximum coupon limit for the day')
    }
      
})



router.get('/claimedusercoupons',auth,isadmin,async(req,res)=>{
    try{
        const claimedcoupons =await Coupon.find({couponstatus:true})
        res.status(400).send(claimedcoupons)
    }catch(e){
        console.log(e)
         res.status(400).send("Unable to find claimed coupons")
    }   
})



router.get('/countofcoupons',auth,isadmin,async(req,res)=>{
    try{
        const totalcouponscount = await Coupon.countDocuments({})
        const claimedcouponscount =await Coupon.countDocuments({couponstatus:true})
        const unsoldcoupons=await Coupon.find({couponstatus:false})
        const unsoldcouponscount =totalcouponscount - claimedcouponscount
        if(totalcouponscount ===claimedcouponscount){
            res.status(400).send('Coupons are out of Stock !!All Coupons claimed by Users') 
        }
        
        res.status(200).json({
            "Total Coupons":totalcouponscount,
            "ClaimedCouponsCount":claimedcouponscount,
            "RemainingCouponsCount":unsoldcouponscount,
            "UnClaimedCoupons":unsoldcoupons
        })
    }catch(e){
        res.status(400).send("Unable to fetch Coupon Count")
    }
     
})

module.exports=router
