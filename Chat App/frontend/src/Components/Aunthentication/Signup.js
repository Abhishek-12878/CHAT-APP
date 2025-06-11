import { Button, FormControl, FormLabel, InputGroup, InputRightElement, useToast} from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';



const Signup = () => {
  const [show,setShow]=useState(false)
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading,setLoading]=useState(false);
  const toast=useToast();
  const history=useHistory();

  // const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  // const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const handleClick=()=> setShow(!show);

  const postDetails=(pics)=>{
    setLoading(true);
    if(pics===undefined){
        toast({
          title: "Please Select an Image!",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom"
        });
        return;
    }
    if (pics.type==="image/jpeg" || pics.type==="image/png"){
      const data=new FormData();
      data.append("file",pics);
      data.append("upload_preset","Chat-app");
      data.append("cloud_name","dsmo2c2r3")
      console.log("Uploading to Cloudinary...");
      fetch(`https://api.cloudinary.com/v1_1/dsmo2c2r3/image/upload`,{
        method:"post",
        body:data,
      }).then((res)=> res.json())
      .then(data=>{
        setPic(data.url.toString());
        
        setLoading(false)
      })
      .catch((err)=>{
        console.error("Cloudinary upload error:", err);
        // console.log(err);
        setLoading(false)
      });
    }else{
     toast({
          title: "Please Select an Image!",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom"
        });
    }
  };

  const submitHandler=async()=>{
       setLoading(true);
       if(!name || !email || !password || !confirmpassword){
        toast({
          title: "Please Fill all the Feilds",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom"
        });
        setLoading(false);
        return
       };

       if (password!==confirmpassword){
         toast({
          title: "Password Do Not Match",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom"
        });
        return
       }
       try {
        const config={
          headers:{
            "Content-type":"application/json",
          },
        };
        const {data}=await axios.post("api/user",
          {name,email,password,pic},
          config
        );
         toast({
          title: "Registration Successful",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom"
        });

        localStorage.setItem("userInfo",JSON.stringify(data));
        setLoading(false);
        history.push('/chats')
       } catch (error) {
         toast({
          title: "Error Occured!",
          description: error?.response?.data?.message || error.message || "Unknown error occurred",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:"bottom"
        });
       }
  };
//   const [picLoading, setPicLoading] = useState(false);
  return  <VStack spacing='5px' >
    <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input 
        placeholder='Enter Your Name'
        onChange={(e)=> setName(e.target.value)}
        />
    </FormControl>
        <FormControl id="Signup-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
        placeholder='Enter Your Email'
        onChange={(e)=> setEmail(e.target.value)}
        />
    </FormControl>
        <FormControl id="Signup-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input 
        type={show? "text":"password"}
        placeholder='Enter Your Password'
        onChange={(e)=> setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
           {show ? "Hide":"Show"}
        </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>

        
        <FormControl id="Confirm-password" isRequired>
        <FormLabel>Confirm Passward</FormLabel>
        <InputGroup size="md">
        <Input 
        type={show? "text":"password"}
        placeholder="Confirm password"
        onChange={(e)=> setConfirmpassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
           {show ? "Hide":"Show"}
        </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>

       
        <FormControl id="pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        
        <Input 
        type="file"
        p={.5}
        accept="image/*"
        onChange={(e)=> postDetails(e.target.files[0])}
        />
    </FormControl>

    <Button
    colorScheme="blue"
    width="100%"
    style={{marginTop:15}}
    onClick={submitHandler}
    isLoading={loading}
    >
        Sign Up
    </Button>
  </VStack>
}

export default Signup
