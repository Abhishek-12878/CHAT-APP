import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider"
import SideDrawer from "../Components/miscllaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import { useState } from "react";


const Chatpage = () => {
   const {user}=ChatState();
   const [fetchAgain,setFetchAgain]=useState(false);
   
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
       { user && (<MyChats fetchAgain={fetchAgain} />)}
        {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>)}
      </Box>
    </div>
  )
}

export default Chatpage


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Chatpage = () => {
//   const [chats, setChats] = useState([]);

//   const fetchChats = async () => {
//     try {
//       const userInfo = JSON.parse(localStorage.getItem("userInfo"));

//       const config = {
//         headers: {
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };

//       const { data } = await axios.get('/api/chat', config);
//       setChats(data);
//     } catch (error) {
//       console.error("Failed to fetch chats:", error);
//     }
//   };

//   useEffect(() => {
//     fetchChats();
//   }, []);

//   return (
//     <div>
//       {chats.map((chat) => (
//         <div key={chat._id}>{chat.chatName}</div>
//       ))}
//     </div>
//   );
// };

// export default Chatpage;
