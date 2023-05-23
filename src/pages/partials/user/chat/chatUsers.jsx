import React, { useState } from 'react'
import { useEffect } from 'react'

import './chatCSS/chatUsers.css'

import axios from 'axios'

export const ChatUsers = ({mode,username,onSelectUser}) => {
  const [userValues, setUserValues] = useState(null)
  useEffect(() => {
    if(mode === 'personel'){
      axios.get('/chatUserList',{
        params:{
          username
        }
      })
      .then((res)=>{
        setUserValues([...res.data.data])
      })
      .catch((err) => {
        console.error(err)
      })

    }
  }, [mode])
  const handleSelectUser = (e) => {
    onSelectUser(e.currentTarget.dataset.username)
  }
  return (
    <div className='usersArea'>
    {userValues ? (
      userValues.map((item, index) => {
        return (
          <div key={index} 
            data-username={item.username} 
            className='selectUser' 
            onClick={handleSelectUser}>
            <div className="picture">
              <img src={item.picture !== '' ? (item.picture) : ('/assest/img/userIcons/unknown.png')} alt={`${item.realname} Profil Fotoğrafı`}/>
            </div>
            <div className="texts">
              <div className="realname">{item.realname}</div>
              <div className="lastContent">{item.lastContent.slice(0,25)+'...'}</div>
            </div>
            {item.isRead === 0 && item.lastMessageSentByUser === 0 ? (
              <div className='notRead'>
                <img src='/assest/img/userIcons/chat_unread.svg' alt='Okunmadı'/>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      })
    ) : (
      <></>
    )}
  </div>

  )
}
