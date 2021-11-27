import React, {useState, useEffect} from 'react';
import {useChatContext} from 'stream-chat-react';
import {ResultsDropdown} from './';
import { SearchIcon } from '../assets';

const ChannelSearch = ({setToggleContainer}) => {
 const { client, setActiveChannel } = useChatContext();
 const [query, setQuery] = useState('');  
 const [loading, setLoading] = useState(false);
 const [teamChannels, setTeamChannels] = useState([]);
 const [directChannels, setDirectChannels] = useState([]);

 useEffect(() => {
    if(!query){
         setTeamChannels([])
         setDirectChannels([])
    }
 }, [query])
 const getChannels = async (text) => {
   try {
      const channelResponse = client.queryChannels({
         type: 'team', 
         name: {$autocomplete: text}, 
         members: {$in: [client.userID]}
      }); 
      const userResponse = client.queryUsers({
         id: {$ne: client.userID},
         name: {$autocomplete: text},
      })
      //we have to do it once we have a logged in use in the chat
      // once we have a few chat messages, message channels and so on
      const [channels, {users}] = await Promise.all([channelResponse, userResponse]);

      if(channels.length) setTeamChannels(channels);
      if(users.length) setDirectChannels(users);
   } catch (error) {
       setQuery('') //make the query to nothing, just to reset the search
   }
 } // this has to be async function because we have to wait the channel to be
  //fetched,
  
  
 const onSearch = (event)=> {
  event.preventDefault(); //we have to do this, everytime we have input 
  // buttons, because the usual browser behavior is whenever you click submit
  // or something similar to reload the page, we are working with react, we want
   //everyting to be reactive, and instanenous, we want to prevent that

   setLoading(true);
   setQuery(event.target.value); // remember in react, when you type something in
   // input, you get that value under event.target.value
   getChannels(event.target.value); 

 }

 const setChannel = (channel) => {
    setQuery('');
    setActiveChannel(channel);

 }

 return (
  <div className="channel-search__cont ainer">
     <div className="channel-search__input__wrapper">
         <div className="channel-search__input__icon">
            <SearchIcon/>
         </div>
         <input 
               className="channel-search__input__text"
               placeholder="Search"
               type="text"
               value={query}
               onChange={onSearch}    
         />
     </div>
      {query && (
         <ResultsDropdown
            teamChannels={teamChannels}
            directChannels={directChannels}
            loading={loading}
            setChannel={setChannel}
            setQuery={setQuery}
            setToggleContainer={setToggleContainer}

         />
      )}
  </div>
 )
}

export default ChannelSearch
