import React, { useEffect, useState } from 'react'
import { ChatMode } from './chatMode'
import { ChatUsers } from './chatUsers'

import './chatCSS/chatArea.css'
import { ChatUser } from './chatUser'

import { ChatAreaTop } from './chatMain/chatAreaTop'
import { ChatArea } from './chatMain/chatArea'
import { ChatMessage } from './chatMain/chatMessage'
import axios from 'axios'
import { SchoolChatTop } from './chatType/schoolChatTop'
import { SchoolChat } from './chatType/schoolChat'

const ChatAreaMain = ({username,socketID,socket,params,eduLevel}) => {

  const [modeStatus, setModeStatus] = useState(true)
  const [filterMode, setFilterMode] = useState('personel')
  const [newMessages, setNewMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [schoolName, setSchoolName] = useState('')

  useEffect(() => {
    if(params.receiverU){
      setSelectedUser(params.receiverU)
    }
    if(eduLevel === 13){
      setModeStatus(false)
    }
  }, [])
  

  const changeFilterMode = async (newMode) => {
    setFilterMode(newMode)
    setSelectedUser('')
    if(newMode === 'school'){
      const fetch = await axios.get('/getSchoolForChat',{
        params:{
          username
        }
      })
      setSchoolName(fetch.data.name)
      setSelectedUser('school')
    }
    
  }

  const selectUser = (username) => {
    setSelectedUser(username)
  }
  
  const sendMessage = async ({value,date}) => {
    let messageAPI;
    if(filterMode === 'personel'){
      messageAPI = await axios.post('/newMessageForChat',{
        messageContent : value,
        messageDate : date,
        messageSender : username,
        messageReceiver : selectedUser,
        chatType : filterMode
      })
    }else{
      messageAPI = await axios.post('/newMessageForChat',{
        messageContent : value,
        messageDate : date,
        messageSender : username,
        messageReceiver : schoolName,
        chatType : filterMode
      })
    }
    
    if(messageAPI.data.status){
      setNewMessages([{
        isUserSentMessage : 1,
        content : value,
        date
      }]);
    }else{
      console.error('Bu mesaj gönderilemedi.')
    }

  }
  return (
    <div className='chatArea'>
        <aside className="sideBar">
            <ChatUser username={username}/>
            {modeStatus ? (
              <ChatMode onModeChange={changeFilterMode}/>
            ) : (
              <></>
            )}
            {filterMode === 'personel' ? (
              <ChatUsers username={username} mode={filterMode} onSelectUser={selectUser}/>
            ) : (
              <></>
            )}
            
        </aside>
        
        {selectedUser !== '' ? (
            <div className='mainArea'>
              {filterMode === 'personel' ? (
                <>
                  <ChatAreaTop username={selectedUser}/>
                  <ChatArea 
                  username={{
                    nowUsername : username,
                    toUsername : selectedUser
                  }}
                  newMessages={newMessages}
                  />
                </>

              ) : (
                <>
                  <SchoolChatTop name={schoolName}/>
                  <SchoolChat name={schoolName} username={username} newMessages={newMessages}/>
                </>
              )}
              <ChatMessage onSendMessage={sendMessage}/>
            </div>
          ) : (
            <div className='notSelectedUser'>
              <img src='/assest/img/GeneralIcons/profile_notFound.svg' alt='Bulunamayan Profil Mesajı'/>
              <h1>Hiçbir Kullanıcı Seçilmedi !</h1>
              <h2>Devam etmek için, bir kullanıcı seç</h2>
            </div>
          )}
    </div>
  )
}

export default ChatAreaMain