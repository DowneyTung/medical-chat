import React, {useState, useEffect} from 'react';
import {useChatContext} from 'stream-chat-react';

import { SearchIcon } from '../assets';

const ChannelSearch = () => {
 const [query, setQuery] = useState('');  
 const [loading, setLoading] = useState(false);

 const getChannels = async (text) => {
   try {
      // TODO; fetch channels, 
      //we have to do it once we have a logged in use in the chat
      // once we have a few chat messages, message channels and so on
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
   
  </div>
 )
}

export default ChannelSearch
