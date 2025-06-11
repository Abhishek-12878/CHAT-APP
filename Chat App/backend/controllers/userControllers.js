const asyncHandler=require("express-async-handler")
const User=require("../models/userModel");
const generateToken=require("../config/generateToken")

const registerUser=asyncHandler(async(req,res)=>{
    const{name,email,password,pic}=req.body;

    if (!name|| !email||!password){
        res.status(400);
        throw new Error("Please Enter all the Feilds")
    }
    const userExists=await User.findOne({email});

        if (userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user=await User.create({    //new field for new user
        name,
        email,
        password,
        pic,
    });

    if (user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    } else{
        res.status(400);
        throw new error("Failed to Create the User")
    }
}) ;

const authUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body;

    const user=await User.findOne({email});
    
    if (user &&(await user.matchPassword(password))){  //if user id and passward match with existing one
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })

    }else{
        res.status(401);
        throw new Error("Invalid Email or Password")
    }
});

    // /api/user?  provides=abhisehk like that
    const allUsers=asyncHandler(async(req,res)=>{
        const keyword=req.query.search ?{
           $or:[
            {name:{$regex:req.query.search,$options:"i"}},  //regx is pattern matching string
            {email:{$regex:req.query.search,$options:"i"}},
           ]
        }
        :{};
        const users=await User.find(keyword).find({_id:{$ne:req.user._id}})  //current id that is loged in
        res.send(users)
})

module.exports={registerUser,authUser,allUsers};