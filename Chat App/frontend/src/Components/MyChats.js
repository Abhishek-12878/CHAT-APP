import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Stack, useToast, Box, Text, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from "../config/ChatLogics";
import GroupChatModal from './miscllaneous/GroupChatModel';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    socket,
  } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  // 🔁 Utility to move a chat to the top
  const moveChatToTop = (chatId, latestMessage) => {
    setChats((prevChats) => {
      const updatedChats = [...prevChats];
      const index = updatedChats.findIndex((chat) => chat._id === chatId);

      if (index !== -1) {
        const chatToUpdate = { ...updatedChats[index] };
        if (latestMessage) {
          chatToUpdate.latestMessage = latestMessage;
        }
        updatedChats.splice(index, 1);
        updatedChats.unshift(chatToUpdate);
      }

      return updatedChats;
    });
  };

  // 👂 Socket listener for incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on("message recieved", (newMessageRecieved) => {
      const chatId = newMessageRecieved.chat._id;

      moveChatToTop(chatId, newMessageRecieved);

      if (!selectedChat || selectedChat._id !== chatId) {
        const alreadyNotified = notification.some(
          (n) => n._id === newMessageRecieved._id
        );
        if (!alreadyNotified) {
          setNotification((prev) => [newMessageRecieved, ...prev]);
        }
      }
    });

    return () => socket.off("message recieved");
  }, [socket, selectedChat, chats, notification]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats

        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              const unreadCount = notification.filter(
                (n) => n.chat._id === chat._id
              ).length;

              return (
                <Box
                  onClick={() => {
                    setSelectedChat(chat);
                    // Clear notifications for this chat when opened
                    setNotification((prev) =>
                      prev.filter((n) => n.chat._id !== chat._id)
                    );
                  }}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text fontWeight="bold">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {unreadCount > 0 && (
                    <Box
                      bg="red.500"
                      borderRadius="full"
                      px={2}
                      py={0.5}
                      color="white"
                      fontSize="xs"
                      ml={2}
                    >
                      {unreadCount}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
