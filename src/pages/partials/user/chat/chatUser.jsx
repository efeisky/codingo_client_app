import React, { useEffect, useState } from 'react'
import axios from 'axios'

import './chatCSS/chatUser.css'

export const ChatUser = ({username,userType='personal'}) => {
    const [userDetail, setUserDetail] = useState({
        username : '',
        pictureSrc : '',
        realName : ''
    })

    useEffect(() => {
      axios.get('/api/userDetailForChat',{
        params:{
            username
        }
      })
      .then((res)=> {
        setUserDetail({
            username : username,
            pictureSrc : res.data.pictureSrc,
            realName : res.data.realName
        })
      })
      .catch(err => console.error(err))
    }, [])
    
  return (
    <div className='chatUser'>
        <img src={userDetail.pictureSrc} alt='Profil Fotoğrafı' srcset={'/favicon.ico'}/>
        <div className="names">
            <div className="realName">{userDetail.realName}</div>
            <div className="userName">@{userDetail.username}</div>
        </div>
    </div>
  )
}
