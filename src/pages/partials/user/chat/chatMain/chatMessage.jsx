import React, { useState } from 'react'
import './../chatCSS/chatMessage.css'

export const ChatMessage = ({onSendMessage}) => {
  const [messageValue, setMessageValue] = useState('')
  
  const sendMessage = () => {
    if(messageValue !== ''){
      onSendMessage({
        value : messageValue,
        date : new Date().toISOString()
      })
      setMessageValue('')
    }else{
      console.log('Mesaj girmeniz gerekli')
    }
    
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  return (
    <div className='messageSendArea'>
      <input 
        type="text" 
        placeholder='Mesajınızı Giriniz' 
        id='messageInput' 
        value={messageValue}
        onChange={(e) => setMessageValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="sendMessage" onClick={sendMessage}>
        <img src='/assest/img/userIcons/chat_send.svg' alt='Mesajı Gönder'/>
      </button>
    </div>
  )
}
