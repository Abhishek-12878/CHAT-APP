 export const getSender=(loggedUser,users)=>{  //simple use the logged in and users of the array
    return users[0]._id ===loggedUser._id ? users[1].name:users[0].name;
 }

  export const getSenderFull=(loggedUser,users)=>{  //simple use the logged in and users of the array
    return users[0]._id ===loggedUser._id ? users[1]:users[0];
 }

 export const isSameSender = (messages, m, i, userId) => {  //m for current message i for current index 
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||   //oher user profil pic see afer sendin the msg and 
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&               //at the bollom of all the msg like whatsapp
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, m, i) => {   //checking 
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};