const User = require("../model/user")
const jwt = require('jsonwebtoken');

const auth = async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.SECRET)
        const user= await User.findOne({_id:decode.id,'tokens.token':token})
        req.user=user
        next()
    }
    catch(e){
        res.status(503).send('Unable to Authenticate the User')
    }
 

}

const isadmin =async(req,res,next)=>{
         if(req.user.role === 0){
             res.status(403).send('You are not an Admin !!Access Denied')
          }
          next()
     }

module.exports={
    auth,
    isadmin
}