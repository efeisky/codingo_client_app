import React from 'react'
import { useEffect,useState,useRef } from 'react'
import axios from 'axios'

import Loader from './../../../PartialLoader/Loader'

import './../chatCSS/chatMessagesArea.css'

export const SchoolChat = ({name,username,newMessages}) => {
    const scroolRef = useRef(null)
  const [messageList, setMessageList] = useState([])
  const [isWorking, setIsWorking] = useState(true)

  const addNewMessage = () => {
    if(newMessages.length !== 0){
      newMessages[0].sender = username
      setMessageList(prev => [...prev,...newMessages])
    }
  }

  const setData = () => {
    axios.get('/api/messageListBySchoolChat',{
      params:{
        username,
        name
      }
    })
    .then((res) => {
      setMessageList([...res.data.data])
      setIsWorking(false)
    })
    .catch(err => console.error(err))
  }

  useEffect(() => {
    
    setData()
  }, [])
  

  useEffect(() => {
    addNewMessage()
    const chatWindow = scroolRef.current;
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
  }, [newMessages])
  return (
    <div className='messages' ref={scroolRef}>
      {isWorking ? (
        <Loader title={'Mesajlar Alınıyor..'}/>
      ) : (
        messageList.length !== 0 ? (
          <>
              {messageList.map((message,key) => (
              <div className={message.isUserSentMessage ? ('message transmitted') : ('message incoming')} key={key}>
                <div className='sender'>
                    {message.sender}
                </div>
                <div className="messageContent">
                  {message.content}
                </div>
                <div className='messageDate'>
                  {new Date(message.date).toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'})}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className='noMessage'>
            <span id='boldText'>Bu sohbet, uçtan uca şifrelenerek korunacaktır. </span>
            <span id='thinText'>Güvenle konuşmaya başlayabilirsiniz.</span>
          </div>
        )
        
      )}
        
    </div>
  )
}
