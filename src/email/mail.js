const nodemailer = require("nodemailer");


const sendMail = async (email,couponcode,secretcode)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: process.env.COUPON_EMAIL,
            pass: process.env.COUPON_PASS,
        },
      });
      console.log('Hello')
      const response = await transporter.sendMail({
        from:process.env.COUPON_EMAIL, 
        to: email, 
        subject: "Food Coupon for the day", 
        text: `Your VoucherCode for Swiggy Coupon is ${couponcode} and VoucherPin is ${secretcode}`
      },
        
      )
      console.log('Hi')
      console.log("Mail Response",response)  
      return response.response.slice(10,12) 
 
}

module.exports=sendMail 