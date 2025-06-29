 import {  createContext, useContext, useEffect,useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

 const ChatContext=createContext();

 const ChatProvider=({children})=>{
     const [user,setUser]=useState();       //contains the user data
     const [selectedChat, setSelectedChat]=useState();
     const [chats,setChats]=useState([]);
     const [notification,setNotification]=useState([]);
     
     const history=useHistory();
     useEffect(()=>{         //to store the data in local storage
          const userInfo=JSON.parse(localStorage.getItem("userInfo"));
          setUser(userInfo);
          if (!userInfo) history.push("/");
           
     },[history]);
    return( 
    <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
        {children}
        </ChatContext.Provider>
        )
 };

 export const ChatState=()=>{
    return useContext(ChatContext)
 }

 export default ChatProvider;