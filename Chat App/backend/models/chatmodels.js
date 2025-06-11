 const mongoose=require('mongoose')

 const chatModel=mongoose.Schema(
    {
        chatName:{type:String,trim:true},
        isGroupChat:{type:Boolean,default:false},
        users:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User" ,      //that contains the id for the particuler user
        },
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
            ref:"User",
    },
    },
    {
        timestamps:true,  //show the time of msg
    }
);

const Chat=mongoose.model("Chat",chatModel)

module.exports=Chat;
