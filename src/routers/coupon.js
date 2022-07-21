const express = require('express')
const router = new express.Router()
const Coupon=require('../model/coupon')
const sendmail=require('../email/mail')
const User=require('../model/user')
const auth=require('../middleware/auth')

//Admin
router.post('/create/coupon', (req,res)=>{
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
        const response=await sendmail(user.email,coupon.couponcode,coupon.secretkey)         
        if(response === process.env.MAILSTATUS){
          const updatedcoupon =await Coupon.findByIdAndUpdate({_id:coupon._id},{couponstatus:true,couponowner:user._id},{new:true}) 
          await User.findByIdAndUpdate({_id:updatedcoupon.couponowner},{
            userrequeststatus:true,
            couponreceiveddate:new Date(),
            $inc : {usercouponcount : 1}
           })
        }
        res.status(200).json({
        couponcode:coupon.couponcode,
        secretKey:coupon.secretkey
        })
    }

    catch(e){   
      res.status(400).send('You have reached maximum coupon limit for the day')
    }
      
})


//Admin
router.get('/claimedusercoupons',async(req,res)=>{
    try{
        const claimedcoupons =await Coupon.find({couponstatus:true})
        for(const i in claimedcoupons){
            await claimedcoupons[i].populate('couponowner').execPopulate()
             const usercoupon = claimedcoupons[i].toObject()
             delete usercoupon.couponowner.role
             delete usercoupon.couponowner.userrequeststatus
             delete usercoupon.couponowner.usercouponcount
             delete usercoupon.couponowner.couponreceiveddate
             delete usercoupon.couponowner._id
             delete usercoupon.couponowner.tokens
             delete usercoupon.couponowner.password
             claimedcoupons[i]=usercoupon
        }
        res.status(400).send(claimedcoupons)
    }catch(e){
        console.log(e)
         res.status(400).send("Unable to find claimed coupons")
    }   
})


//Admin
router.get('/countofcoupons',async(req,res)=>{
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