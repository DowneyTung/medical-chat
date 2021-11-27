import React, {useEffect, useState} from 'react';
import {Avatar, useChatContext} from 'stream-chat-react';

import {InviteIcon} from '../assets';

const ListContainer = ({children}) => {
  return(
   <div className="user-list__container">
       <div className="user-list__header">
         <p>User</p>
         <p>Invite</p>
       </div>
       {children}
   </div>
  )
}

const UserItem = ({user, setSelectedUsers}) => {
 const [selected, setSelected] = useState(false)

 const handleSelect = () => {
  if(selected) {
      setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
      // we are keeping all the selected users so far, but removing the one we clicked right now 
  } else {
   setSelectedUsers((prevUsers) => [...prevUsers, user.id]) //append our current user id to the prevUsers
  }

  setSelected((prevSelected) => !prevSelected);
 }

 return(
  < div className="user-item__wrapper" onClick={handleSelect}>
   <div className="user-item__name-wrapper">
       <Avatar image={user.image} name={user.fullName || user.id} size={32}/>
       <p className="user-item__name">{user.fullName || user.id}</p>
   </div>
   {selected ? <InviteIcon/> : <div className="user-item__invite-empty"/> }
  </div>
 )
}

const UserList = ({ setSelectedUsers }) => {
 const { client }  = useChatContext();
 const [users, setUsers] = useState([]);
 const [loading, setLoading] = useState(false);
 const [listEmpty, setListEmpty] = useState(false);
 const [error, setError] = useState(false);

 useEffect(() => {
   const getUsers = async () => {
    if(loading) return;

    setLoading(true);

    try {
       const response = await client.queryUsers(
          {id: {$ne: client.userID}}, 
          {id: 1},
          {limit: 8 }
       );

       if(response.users.length){
        setUsers(response.users);
       } else {
            setListEmpty(true);
       }
    } catch(error) {
     setError(true);  
     console.log(error);
    }
    setLoading(false);
   }
   if(client) getUsers()
   }, []); //we are going to call this when something changes, more specifically, we want to call it when filters change

   if (error) {
     return (
      <ListContainer>
       <div className="user-list__message">
        Error loading, please refresh and try again.
       </div>
      </ListContainer>
     )
    }


   if (listEmpty) {
     return (
      <ListContainer>
       <div className="user-list__message">
            No users found. 
       </div>
      </ListContainer>
     )
    }


 return (
  <ListContainer>
   {loading ? <div className="user-list__message">
         Loading users....
   </div> : (
      users?.map((user, i) => (
       <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers}/>
      ))
   )}
  </ListContainer>
 )
}

export default UserList;