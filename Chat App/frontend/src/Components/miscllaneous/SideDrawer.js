import {Box,DrawerContent,DrawerHeader,DrawerOverlay,MenuDivider,MenuItem,MenuList,Spinner,Text, useToast} from "@chakra-ui/react"
import {Menu,MenuButton,Tooltip,Drawer,DrawerBody,Input} from "@chakra-ui/react"
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons"
import { Button } from "@chakra-ui/react"
import { Avatar,Toast } from "@chakra-ui/react"
import React, { useState } from 'react'
import {ChatState} from "../../Context/ChatProvider"
import ProfileModel from "./ProfileModel"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useDisclosure } from "@chakra-ui/hooks"
import axios from "axios"
import ChatLoading from "../ChatLoading"
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics"
// import { Effect } from "react-notification-badge"
// import NotificationBadge from "react-notification-badge"
// import {spinner } from "@chakra-ui/spinner";

const SideDrawer=()=> {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState(false);

  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();
  const history=useHistory();
  const {isOpen,onOpen,onClose}=useDisclosure()

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    history.push("/")
  };
   
  const toast=useToast();

  const handleSearch=async ()=>{
      if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return
  }

  try {
    setLoading(true);

    const config={        //jwt token they maade this protected so we take these header
      headers:{
        Authorization: `Bearer ${user.token}`,
      },
    };

    const {data}=await axios.get(`/api/user?search=${search}`,config)

    setLoading(false);
    setSearchResult(data);
  } catch (error) {
    toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
  }
};

const accesssChat=async (userId)=>{
  try{
    setLoadingChat(true);

    const config={
      headers:{
        "Content-type":"application/json",
        Authorization:`Bearer ${user.token}`,
      },
    };

    const {data}=await axios.post("/api/chat",{userId},config);

    if(!chats.find((c)=> c._id === data._id)) setChats([data,...chats]);   //if chat is already in that so we can append it  and than update it setcahts
      setSelectedChat(data);
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
  } catch(error){
     toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
  }
};

  return (
    <>
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"

      >
      <Tooltip label="Search Users to chat"
       hasArrow placement="bottom-end">
      <Button variant="ghost" onClick={onOpen}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <Text display={{base:"none", md:"flex"}} px="4">
          Search User
        </Text>
      </Button>
      </Tooltip>

      <Text fontSize="2xl" fontFamily="Work sans">
        Chater
        </Text>
         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Menu>
  <MenuButton p={1} position="relative">
    <BellIcon fontSize="2xl" m={1} />
    {notification.length > 0 && (
      <Box
        position="absolute"
        top="-1"
        right="-1"
        bg="red.500"
        color="white"
        borderRadius="full"
        px={2}
        fontSize="xs"
      >
        {notification.length}
      </Box>
    )}
  </MenuButton>
  <MenuList pl={2}>
    {!notification.length && "No New Messages"}
    {notification.map((notif) => (
      <MenuItem
        key={notif._id}
        onClick={() => {
          setSelectedChat(notif.chat);
          setNotification(notification.filter((n) => n !== notif));
        }}
      >
        {notif.chat.isGroupChat
          ? `New Message in ${notif.chat.chatName}`
          : `New Message from ${getSender(user, notif.chat.users)}`}
      </MenuItem>
    ))}
  </MenuList>
</Menu>

            <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size="sm"
               cursor="pointer" 
               name={user.name} 
               src={user.pic}
               />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider/> 
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
          </div>   
         </Box>
        
        <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay/>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                      <DrawerBody>
            <Box display="flex" pb={2}>
              <Input placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
              />
              <Button
              onClick={handleSearch}
              >
                GO
              </Button>

            </Box>
            {loading?(
              <ChatLoading/>
            ):(
              searchResult?.map(user=>(   //access the user data
                <UserListItem    //to display the data
                key ={user._id}
                user={user}
                handleFunction={()=>accesssChat(user._id)}
                />
              ))
            
            )}
            {loadingChat && <Spinner ml="auto" display="flex"/>}
            
          </DrawerBody>
          </DrawerContent>

        </Drawer>
    </>
  )
}

export default SideDrawer

