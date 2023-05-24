import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import './ChangePassword.css'
import { decrypt } from '../../getUserPages';
import axios from 'axios';

export const ChangePassword = () => {
    const {usernameParam} = useParams()
    let isAuth=false;
    const [isUploading, setIsUploading] = useState(true)
    let secretKey,plainUsername;
    try {
      const localData = JSON.parse(window.localStorage.getItem('token_profile'));
      secretKey = localData.authProperty;
      plainUsername = decrypt(localData.secretUsername,secretKey)
      if (plainUsername === usernameParam) { isAuth = true; } else { window.open(`/${plainUsername}`, '_self'); }
    } catch (err) {
      console.error(err)
      window.open(`/${usernameParam}/profile`,'_self')
    }
    const [error, setError] = useState(false)
    const [password, setPassword] = useState('')
    const saveNewPass = async() => {
      const putReq = await axios.put('/api/changePassword',{
        name : plainUsername,
        password : password
      })
      if(putReq.data.saveStatus){      
        window.open(`/${plainUsername}`, '_self');
      }else{
        setError(true)
      }
    }
  return (
    <>
    {isAuth ? (
      <div className='passArea'>
      <h1>Şifremi Değiştir</h1>
      <span>Yeni Şifrenizi Aşağıya Giriniz</span>
      <input
      type='password'
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      placeholder='Yeni Şifreniz'
      />
      {error ? (
        <div id='error'>
          <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
          <span>Bir hata oluştu.. Lütfen sonra tekrar deneyiniz.</span>
        </div>
      ) : (<></>)}
      <button onClick={saveNewPass}>Yeni Şifreyi Kaydet</button>
    </div>
    ) : (
      <></>
    )}
    </>
    
  )
}
