const User = require("../model/user")
const jwt = require('jsonwebtoken');
const auth = async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,'coupon-secret')
        const user= await User.findOne({_id:decode.id,'tokens.token':token})
        req.user=user
        next()
    }
    catch(e){
        res.status(503).send('Unable to Authenticate')
    }
 

}
module.exports=auth