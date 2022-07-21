const nodemailer = require("nodemailer");


const sendMail = async (email,couponcode,secretcode)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: 'systemcoupon@gmail.com',
            pass: 'isrsyfxamdsclypl',
        },
      });
      const response = await transporter.sendMail({
        from: 'systemcoupon@gmail.com', 
        to: email, 
        subject: "Food Coupon for the day", 
        text: `Your VoucherCode for Swiggy Coupon is ${couponcode} and VoucherPin is ${secretcode}`
      })
      return response.response.slice(10,12)    
}

module.exports=sendMail 