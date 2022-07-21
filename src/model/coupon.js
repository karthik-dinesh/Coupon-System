const { ObjectId } = require('mongoose')
const mongoose=require('mongoose')
const {Schema} = mongoose

const CouponSchema = new Schema({
    couponcode:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    secretkey:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    couponstatus:{
        type:Boolean,
        default:false
    },
    couponowner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

})

module.exports=mongoose.model('Coupon',CouponSchema)