 import React, { useState,useEffect } from 'react'
 import { ChatState } from '../Context/ChatProvider'
import { Box,Text, useToast } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from '../config/ChatLogics';
import ProfileModel from './miscllaneous/ProfileModel';
import UpdateGroupChatModel from './miscllaneous/UpdateGroupChatModel';
import { Spinner,FormControl ,Input} from '@chakra-ui/react';
import axios from 'axios';
import "./styles.css"
import ScrollableChat from './ScrollableChat';
import Lottie from "lottie-react"
import animationData from "../Animations/typing.json"

import io from "socket.io-client"

const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare;
 
 const SingleChat  = ({fetchAgain,setFetchAgain}) => {
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [newMessage,setNewMessage]=useState("");
  const [socketConnected,setSocketConnected]=useState(false)
  const [typing,setTyping]=useState(false)
  const [isTyping,setIsTyping]=useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
      
    const toast=useToast()
    const { user, selectedChat, setSelectedChat, notification, setNotification, chats, setChats } = ChatState();

    const moveChatToTop = (chatToMove, latestMessage = null) => {
  setChats((prevChats) => {
    const filteredChats = prevChats.filter((c) => c._id !== chatToMove._id);
    const updatedChat = { 
      ...chatToMove, 
      ...(latestMessage && { latestMessage }) 
    };
    return [updatedChat, ...filteredChats];
  });
};


    const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);


      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);  //create the new room after selecting the chat
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  

  useEffect(()=>{
    socket=io(ENDPOINT)    //import from socket io client
    socket.emit("setup",user);
    socket.on("connected",()=>setSocketConnected(true))
    socket.on("typing",()=> setIsTyping(true))
    socket.on("stop typing",()=> setIsTyping(false))
  },[])


  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat
  },[selectedChat]);


  
  useEffect(()=>{
    socket.on("message recieved",(newMessageRecieved)=>{       //put it into our chat
      if(
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ){
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain)
        }
      } else{
  //       setMessages([...messages,newMessageRecieved])
  //     }
  //   })   
  // })
   setMessages((prev) => [...prev, newMessageRecieved]);
    }

    moveChatToTop(newMessageRecieved.chat, newMessageRecieved);
  });
});

  const sendMessage = async (event) => {
  if (event.key === "Enter" && newMessage) {
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "/api/message",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );

      socket.emit("new message", data);

      setMessages([...messages, data]); // append the new message
      moveChatToTop(data.chat,data);

      
      //  Move the chat to the top of the list
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const index = updatedChats.findIndex((chat) => chat._id === data.chat._id);

        if (index !== -1) {
          const chatToUpdate = { ...updatedChats[index] };
          chatToUpdate.latestMessage = data;
          updatedChats.splice(index, 1);
          updatedChats.unshift(chatToUpdate);
        }

        return updatedChats;
      });

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
};


  
    const typingHandler=(e)=>{
      setNewMessage(e.target.value);
      //show the typing indicator in chat
      if(!socketConnected) return;

      if(!typing){
        setTyping(true);
        socket.emit("typing",selectedChat._id)
      }
         let lastTypingTime=new Date().getTime();                          //when to stop typing
         var timerLength=3000;
         setTimeout(()=>{
          var timeNow=new Date().getTime();
          var timeDiff=timeNow-lastTypingTime;

          if(timeDiff>=timerLength && typing){
            socket.emit("stop typing",selectedChat._id);
            setTyping(false)
          }
         },timerLength)

        }
   return (
     <>
     {selectedChat ? (
        <>
        <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}  //if i slected the chat this become empty
            />
          
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModel
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModel
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
          </Text>
          <Box 
           display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            // h="100%"
            h="calc(100vh - 120px)" // Adjust based on your layout
            borderRadius="lg"
            overflowY="hidden"
          >
             {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
             ):(
              <div className='messages'>
                <ScrollableChat messages={messages}/>
              </div>
             )}
              <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={20}
                    width={40}
                    style={{ marginBottom: 10, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
     ):(
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                Click on a user tio start chatting
            </Text>

        </Box>
     )}
     </>
   )
 }
 
 export default SingleChat