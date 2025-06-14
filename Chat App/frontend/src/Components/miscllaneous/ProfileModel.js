
import {   Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import React from 'react'

const ProfileModel = ({user,children}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ):(
        <IconButton display={{base:"flex"}} icon ={<ViewIcon/>} onClick={onOpen}/>
      )}
       <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
             display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
           display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            
          <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
           </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            {/* <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel
