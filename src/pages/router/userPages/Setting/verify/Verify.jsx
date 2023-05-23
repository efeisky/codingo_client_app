import React, { useState } from 'react'
import InputMask from 'react-input-mask';
import { useParams } from 'react-router-dom';
import './Verify.css'
import axios from 'axios';
import { decrypt } from '../../getUserPages';

export const Verify = () => {
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
    const [isSended, setIsSended] = useState(false)
    const [codeValue, setCodeValue] = useState('')
    const [key, setKey] = useState('')
    const [error, setError] = useState(false)
    const [retryCodeText, setRetryCodeText] = useState(false)
    const sendCode = async() => {
        const code = await axios.post('/sendVerificationCode',{
            name : usernameParam
        })
        if(code.data.status){
            setIsSended(true)
            setKey(code.data.formattedKey)
        }else{
            alert('Sistemsel bir hata oluştu.')
        }
    }
    const retryCode = async() => {
        setCodeValue('')
        setError(false)
        await sendCode()
        setRetryCodeText(true)
    }
    const setVerify = async() => {
        const verify = await axios.put('/setVerify',{
            name : usernameParam,
            type : 'Email'
        })
        if(verify.data.status){
            window.open(`/${usernameParam}`,'_self')
        }else{
            alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.')
        }
    }
    const checkCode = () => {
        if(codeValue === key){
            setError(false)
            setVerify()
        }else{
            setError(true)
        }
    }
  return (
    <div className='verifyArea'>
        <h1>Email ile Hesap Doğrulama</h1>

        {!isSended ? (
            <>
                <div id='text'>Aşağıdaki butona basmadan önce e-mail adresinizi açmanız önerilmektedir. Herhangi bir süre kısıtlaması bulunmamaktadır.</div>
                <button onClick={sendCode} id='codeButton'>Doğrulama Kodunu Gönder</button>
            </>
        ) : (
            <>
                <div id='text'>E-Mail hesabına, doğrulama kodu gönderdik. Hesabınıza gelen 16 haneli kodu buraya giriniz.</div>
            
                <InputMask 
                mask="**** **** **** ****" 
                maskChar="_" 
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                placeholder='Gelen Kodu Giriniz'
                />
                {error ? (
                <div id='error'>
                    <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
                    <span>Yanlış Kod</span>
                </div>
                ) : (<></>)}
                <button onClick={checkCode}  id='codeButton'>Kontrol Et</button>
                <div id='noCode'>Eğer hesabınıza kod gelmediyse, <span onClick={retryCode}>buraya</span> tıklayarak tekrar gönderin.</div>
                {retryCodeText ? (
                    <div id='text'>Kod Tekrardan Gönderildi.</div>
                ) : (
                    <></>
                )}
            </>
        )}
    </div>
  )
}
