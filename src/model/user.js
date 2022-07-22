
const mongoose=require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const UserSchema = new Schema({
   name:{
      type:String,
      required:true,
      trim:true
   },
   email:{
      type:String,
      required:true,
      unique:true,
      trim:true
   },
   password:{
     type:String,
     required:true,
     trim:true
   },
   role:{
      type:Number,
      default:0
   },
   userrequeststatus:{
       type:Boolean,
       default:false
   },
   usercouponcount:{
      type:Number,
      default:0
   },
   couponreceiveddate:{
      type:Date,
      default:0
   },
   tokens:[{
      token:{
         type:String,
         required:true
      }
   }]
})


UserSchema.pre('save', async function(next){
       const user=this
       if(user.isModified('password')){
         user.password = await bcrypt.hashSync(user.password , 8);
       }
      next()
})

UserSchema.statics.findByCredentials = async(email,password)=>{
   const user = await User.findOne({email})
   if(!user){
      throw new Error('Unable to login')
   }
   const match = await bcrypt.compareSync(password,user.password)
   if(!match){
      throw new Error('Unable to login')
   }
   return user
}


UserSchema.methods.generateAuthtoken = async function(){
    const user =this
    console.log(user)
    const token =jwt.sign({id:user._id.toString()},process.env.SECRET);
    console.log(token)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
    
}

UserSchema.methods.toJSON =function(){
   const user=this
   console.log("User",user)
   const userObject=user.toObject()
   delete userObject.password
   delete userObject.tokens
   return userObject
}

UserSchema.statics.VerifyUserRequest = async(email)=>{
  const user = await User.findOne({email})
  const date=new Date()
  const currentdate =date.toLocaleDateString()
  const existingdate=user.couponreceiveddate.toLocaleDateString()

  if(currentdate!=existingdate &&user.userrequeststatus===true){
     user.userrequeststatus=false
     user.save()
  }
  if(currentdate === existingdate && user.userrequeststatus===true){
     throw new Error("You have reached maximum coupon limit for the day")
  }

  return user
    
}


const User=mongoose.model('User', UserSchema);
module.exports= User