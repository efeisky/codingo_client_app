import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import { decrypt } from '../../router/userPages/getUserPages'
import './Header.css'
import axios from 'axios'
import Loader from './../PartialLoader/Loader'
const Header = () => {
  const [isRegistered, setIsRegistered] = useState(true)
  const [isUploading, setIsUploading] = useState(true)

  const data = JSON.parse(window.localStorage.getItem('token_profile'))
  let plainUsername = '';
  if(data){
    const secretKey = data.authProperty;
    plainUsername = decrypt(data.secretUsername,secretKey)
  }
  const [headerValues, setHeaderValues] = useState({
    username : '',
    realname : '',
    src : '',
    score : 0
  })

const requestForHeader = async () => {
  const req = await axios.get('/api/headerData',{
    params : {
      username : plainUsername
    }
  }) 
  setHeaderValues({
    username : req.data.username,
    realname : req.data.realname,
    src : req.data.src,
    score : req.data.score
  })
  setIsUploading(false)
}
useEffect(() => {
  if(plainUsername !== ''){
    requestForHeader()
  }else{
    setIsRegistered(false)
    setIsUploading(false)
  }
}, [])
  
  
  return (
    <nav className='navbar'>
      
          {isRegistered ? (
          <>
            {
                  isUploading ? (
                      <Loader title={'Bilgilerin Getiriliyor..'}/>
                  ) : (
                    <>
                      <div className="profilePictureAndNameArea">
                        <img 
                          src={headerValues.src}
                          alt='Profil Resmi'
                          id='profilePicture'
                        />
                        <div className="nameAndScore">
                          <div id="realname">{headerValues.realname}</div>
                          <div id="username">@{headerValues.username}</div>
                          <div id="score">
                            <img 
                              src={'/assest/img/userIcons/Score.svg'}
                              securitypolicy='restricted'
                              alt='Skor Resmi'
                              crossOrigin='anonymous'
                              referrerPolicy='no-referrer'
                            />
                            <span>{headerValues.score} Puan</span>
                          </div>
                        </div>
                    </div>
                    
                
                  <div className="links">
                      <Link to={`/${headerValues.username}`} id='Important'><span >Anasayfa</span></Link>
                      <Link to={`/${headerValues.username}/setting`} id='notImportant'><span>Ayarlar</span></Link>
                      <Link to={`/${headerValues.username}/nots`} id='notImportant'><span>Notlar</span></Link>
                      <Link to={`/${headerValues.username}/order`} id='notImportant'><span>Sıralama</span></Link>
                      <Link to={`/${headerValues.username}/chat`} id='notImportant'><span>Mesajlar</span></Link>
                      <Link to={`/${headerValues.username}/profile`} id='notImportant'><span>Profil Sayfası</span></Link>
                  </div>
                  </>
                  )
            }
          </>
        ) : (
          <>
            <div className='prodImg'>
              <img 
                  src={'/favicon.ico'}
                  securitypolicy='restricted'
                  alt='Profile Resmi'
                  crossOrigin='anonymous'
                  referrerPolicy='no-referrer'
                  id='profilePicture'
              />
              <span>Codingo</span>
            </div>
            <div className="links">
                <Link to={`/`} id='notImportant'><span >Anasayfa</span></Link>
                <Link to={`/about`} id='notImportant'><span>Hakkımızda</span></Link>
                <Link to={`/searchProfile`} id='notImportant'><span>Profil Ara</span></Link>
                <Link to={`/contact`} id='notImportant'><span>Bize Ulaşın</span></Link>
                <div className="importants">
                  <Link to={`/login`} id='loginImportant'><span>Giriş Yap</span></Link>
                  <Link to={`/register`} id='registerImportant'><span>Kayıt Ol</span></Link>
                </div>
            </div>
          </>
        )}  
    </nav>
  )
}

export default Header
