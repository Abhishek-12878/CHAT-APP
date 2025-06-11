
const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes"); // ✅ NEW LINE
const messageRoutes=require("./routes/messageRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path=require("path");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message",messageRoutes);


//---------------Deployment---------------//

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build"))); //make the build folder for us

  app.get("/*all", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))  //send our html fike in build folder
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}



// --------------------------deployment------------------------------

// Error Handling middlewares

const PORT = process.env.PORT || 5000;

const server=app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

const io = require("socket.io")(server,{
  pingTimeout:60000,    //for how much time taken during wait for close the io
  cors:{
    origin:"http://localhost:3000",
  }
})
 
io.on("connection",(socket)=>{
  console.log("connected to socket.io")

  socket.on("setup",(userData)=>{   //user data from frontend and create new room for particular user
     socket.join(userData._id);
     socket.emit("connected");
  })

  socket.on("join chat",(room)=>{
    socket.join(room);
    console.log("user joined eoom:"+room);
    
  })

  socket.on("typing",(room)=>socket.in(room).emit("typing"))
  socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

  socket.on("new message",(newMessageRecieved)=>{
    var chat=newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defiend")
  

   chat.users.forEach((user) => {   //sending the message all not to me like ligin id itself
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    })
  })

  socket.off("setup",()=>{
    console.log("USER DISCONNECTED");
    socket.leave(userData._id)
    
  })
})