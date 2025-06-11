 //this can authorized the user access and veryfy it
 //allow to access this autentication
 const jwt=require("jsonwebtoken")

 const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"30d"
    });

 }

 module.exports=generateToken;