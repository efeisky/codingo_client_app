import axios from 'axios';
import React from 'react'
import { useState,useEffect } from 'react';
import OtpInput from 'react-otp-input';
import CryptoJS from 'crypto-js'
import './forgetPassword.css'

function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [remainingTime, setRemainingTime] = useState({
    minute : 0,
    second : 0
  })
  const [isWriting, setIsWriting] = useState(true)
  const [otp, setOtp] = useState('');
  const [myOtp, setMyOtp] = useState('')
  const createOTPNumber = async () => {
    let selectedOtp = Math.floor(100000 + Math.random() * 900000)
    setMyOtp(selectedOtp.toString())
    return selectedOtp.toString();
  }
  const sendCode = async () => {
    var countDownTime = 5 * 60;
    const myOTP = await createOTPNumber();
    axios.post('/api/forgetPass',{
      email,
      myOTP
    })
    .then((res)=> {
      setIsWriting(false)
    })
    .catch(err => console.error(err))
    const remainedTime = setInterval(() => {
      var minutes = Math.floor(countDownTime / 60);
      var seconds = countDownTime % 60;

      setRemainingTime({
        minute: minutes,
        second: seconds
      })

      if (countDownTime <= 0) {
          clearInterval(remainedTime);
          setMyOtp('')
          window.open('/forgetPassword','_self')
      }
      countDownTime--;
    }, 1000);
    
  }
  const getIPAddress = async () => {
    const { RTCPeerConnection, RTCSessionDescription } = window;
    const pc = new RTCPeerConnection({ iceServers: [] });
    const offer = await pc.createOffer();
    await pc.setLocalDescription(new RTCSessionDescription(offer));
  
    const regex = /\d+\.\d+\.\d+\.\d+/;
    const ipAddress = regex.exec(pc.localDescription.sdp)[0];
    
    return ipAddress;
  }
  
  const setParams = async({email}) => {
    const params = new URLSearchParams()
    const secretKey = CryptoJS.lib.WordArray.random(1024).toString(CryptoJS.enc.Hex)
    const dateString = new Date().toLocaleString()
    let minuteExpire = (parseInt(dateString.split(' ')[1].split(':')[1].split(':')[0]) + 10);
    let secondExpire = (parseInt(dateString.slice(-2)));
    let hourExpire = (parseInt(dateString.split(' ')[1].split(':')[0]));
    if(minuteExpire >= 60){
      hourExpire = Math.floor(minuteExpire / 60) + hourExpire
      minuteExpire = minuteExpire % 60
    }
    if(minuteExpire.toString().length === 1){
      minuteExpire = `0${minuteExpire}`
    }
    if(hourExpire.toString().length === 1){
      hourExpire = `0${hourExpire}`
    }
    
    let date = dateString.split(' ')[0]
    const fullDate = `${date} ${hourExpire}:${minuteExpire}:${secondExpire}`
    const ip = await getIPAddress()
    
    params.append('email',CryptoJS.AES.encrypt(email, secretKey))
    params.append('authCond',secretKey + '.' + CryptoJS.SHA512('authConnected').toString(CryptoJS.enc.Hex))
    params.append('userIp',CryptoJS.AES.encrypt(ip, secretKey))
    params.append('expired-time',CryptoJS.AES.encrypt(fullDate, secretKey))
    window.open(`/forgetPassword/resetPass?${params.toString()}`,'_self')
  }
  const [isTrue, setIsTrue] = useState(true)
  useEffect(() => {
    if(otp.length === 6){
      if(otp === myOtp){
        setParams({email})
      }else{
        setIsTrue(false)
      }
    }
  }, [otp])
  
  return (
    <div className='codeArea'>
      <h1>Şifre Sıfırlama Talebi</h1>
      {
        isWriting ? (
          <div className='sendCodeArea'>
            <input type='email' className='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Emailinizi Giriniz' />
            <button type="submit" onClick={sendCode}>Onay kodu gönder</button>
            
          </div>
        ) : (
          <div className='checkCodeArea'>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span style={{width:'2.5rem'}}></span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width:'5rem',
                height:'7rem',
                fontSize:'2.6rem',
                fontFamily:'Inter, sans-serif',
                fontWeight:'500',
                border: isTrue ? ('1px solid #cbcbcb') : ('1px solid #EA4335'),
                borderRadius:'.5rem',
                outlineColor: '#4285F4'
              }}
            />
            <div id='remainingTime'><span>{remainingTime.minute + '.' + remainingTime.second}</span> dakikan kaldı.</div>
          </div>
            
        )
      }
        
    </div>
  )
}

export default ForgetPassword
