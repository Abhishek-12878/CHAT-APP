import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
  
} from "@chakra-ui/react";
import React from 'react'
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios"; 
import UserListItem from "../UserAvatar/UserListItem"

 const UpgradeGroupChatModel = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleAddUser = async (userToAdd) => {
  // Check if the user is already in the group
  if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
    toast({
      title: "User Already in group!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    return;
  }

  // Only group admin should be able to add
  if (selectedChat.groupAdmin._id !== user._id) {
    toast({
      title: "Only admins can add users!",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/chat/groupadd`,
      {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      },
      config
    );

    setSelectedChat(data);
    setFetchAgain?.(!fetchAgain);  // Safely trigger re-fetch
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: error.response?.data?.message || error.message,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  }
};

const handleRemove = async (userToRemove) => {
  // Only admin or the user themselves can remove
  if (
    selectedChat.groupAdmin._id !== user._id &&
    userToRemove._id !== user._id
  ) {
    toast({
      title: "Only admins can remove users!",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/chat/groupremove`,
      {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      },
      config
    );

    // If current user leaves, deselect the chat
    // if (userToRemove._id === user._id) {
    //   setSelectedChat(null);
    // } else {
    //   setSelectedChat(data);
    // }

    userToRemove._id===user._id ? setSelectedChat():setSelectedChat(data);
    setFetchAgain?.(!fetchAgain);  // Safely trigger re-fetch
    fetchMessages()
    setLoading(false)
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: error.response?.data?.message || error.message,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  }
};


  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      const data = response?.data;

      // console.log("Rename response:", data);
      // console.log(data);
      // console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      // setFetchAgain(!fetchAgain);
      setFetchAgain?.(!fetchAgain);
      setRenameloading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error?.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameloading(false);
    }
    setGroupChatName("");
  };
   const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
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

   return (
     <>
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}>Open Modal</IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          
             <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u)=>(
                <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={()=>handleRemove(u)}
                />
              ))}
             </Box>
             <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              /> 
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}

            </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
   )
 }
 
 export default UpgradeGroupChatModel
 