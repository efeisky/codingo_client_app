import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const OrderPartial = ({nowUsername,realname,username,score,picture,orderRank}) => {

  const [styleOptions, setStyleOptions] = useState({
    bgColor : '#FFF',
    isWho : false
  })
    const [menuStatus, setMenuStatus] = useState(false)
    useEffect(() => {
      if(nowUsername === username){
        setStyleOptions({
          bgColor : 'rgba(58, 205, 126,10%)',
          isWho : true
        })
      }else{
        setStyleOptions({
          bgColor : '#FFF',
          isWho : false
        })
      }
    }, [])
    
  return (
    <div className='user' style={{backgroundColor: styleOptions.bgColor}}>
        <div className="left">
          <div className="rank">
            {typeof orderRank === 'string' ? (
              <img
              src={orderRank === 'firstUser' ? '/assest/img/userIcons/order_gold_medal.svg' :
              (orderRank === 'secondUser' ? '/assest/img/userIcons/order_silver_medal.svg' : '/assest/img/userIcons/order_bronze_medal.svg')}
              securitypolicy='restricted'
              alt='Sıralama Resmi'
              crossOrigin='anonymous'
              referrerPolicy='no-referrer'
              id='orderImage'
              />
            ) : orderRank}
          </div>
          

            <img src={(picture === '' ? ('/assest/img/userIcons/unknown.png') : (picture))} alt='Profil Fotoğrafı' id='pictureProfile'/>
            <div className="nameArea">
                <div className="realname">{realname}</div>
                <Link to={`/${username}/profile`} className="username">@{username}</Link>
                <div className="options">
                  <img 
                  src='/assest/img/userIcons/order_threeDots.svg' 
                  alt='Option Menu' 
                  className="optionSvg"
                  onMouseMove={()=>setMenuStatus(true)}
                  />

                  <div 
                  className="optionMenu" 
                  style={{display: menuStatus ? ('flex') : ('none') }}
                  onMouseLeave={()=>setMenuStatus(false)}
                  >
                    {styleOptions.isWho ? (
                      <></>
                    ) : (
                      <div className="option">
                        <img src='/assest/img/userIcons/order_chat.svg' alt='Sohbet Et'/>
                        <Link to={`/${nowUsername}/chat?vrd=order&receiverU=${username}`}>Sohbet Et</Link>
                      </div>
                    )}
                    
                    <div className="option">
                    <img src='/assest/img/userIcons/order_profile.svg' alt='Profiline Git'/>
                      <Link to={`/${nowUsername}/profile`}>Profiline Git</Link>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        
        <div className="score">{score} puan</div>
    </div>
    
  )
}

export default OrderPartial