import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'
import { useEffect,useState } from 'react';
import CryptoJS from 'crypto-js'

import Loader from './../../partials/PartialLoader/Loader'
import Header from './../../partials/PartialHeader/Header'

import './Login.css'
import { Link } from 'react-router-dom';
const Login = () => {

  const [loginValues, setLoginValues] = useState({
    email:'',
    password : '',
    signType : ''
  })
  const [isChecked, setIsChecked] = useState(false);
  const [loginError, setLoginError] = useState({
    state : false
  });

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  }

  const [isLoggining, setIsLoggining] = useState(false)

  const createLoginToken = ({username}) => {
      const secretUserKey = CryptoJS.lib.WordArray.random(2048).toString(CryptoJS.enc.Hex);
      const secretUsername = CryptoJS.AES.encrypt(username, secretUserKey);
      const auth = CryptoJS.AES.encrypt(secretUsername.toString() + '.' + CryptoJS.AES.encrypt('access-provider-auth-connect', secretUserKey) + CryptoJS.lib.WordArray.random(1024).toString(CryptoJS.enc.Hex),secretUserKey);

      const token = {
        secretUsername: secretUsername.toString(),
        authConnect: auth.toString(),
        authProperty: secretUserKey.toString(),
        authStatus: 1
      }
      window.localStorage.setItem('token_profile',JSON.stringify(token))
      setIsLoggining(false)
      window.open(`/${username}`,'_self')
  }

  const loginRequest = ({email,password = ''},signType) => {
    setIsLoggining(true)
    if(signType === 'Google'){
      axios.get('/api/loginUser',{
        params:{
          email,
          signType
        }
      })
      .then((res)=> {
        if(res.data.availabilityStatus === 1){
          createLoginToken({
            username: res.data.Content[0].username
          })
        }else{
          setIsLoggining(false)
          setLoginError({
            state : true
          })
        }
      })
    }else{
      axios.get('/api/loginUser',{
        params:{
          password,
          email,
          signType
        }
      })
      .then((res)=> {
        if(res.data.availabilityStatus === 1){
          createLoginToken({
            username: res.data.Content[0].username
          })
        }else{
          setIsLoggining(false)
          setLoginError({
            state : true
          })
        }
      })
    }
  }
  const handleChange = (e) => setLoginValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  
  const handleLogin = (e) => {
    e.preventDefault()
    loginRequest({
      email: loginValues.email,
      password: loginValues.password
    },'Email')
  }
  const  login  = useGoogleLogin({
    onSuccess: (response) => {
      
      if(response.access_token){
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`)
        .then((response) => response.json())
        .then((userData) => {
          
          setLoginValues({
            email: userData.email,
            username: '',
            signType: 'Google'
          })
        })
        .catch((error) => {
          console.log(error);
        });
      }
    },
    onFailure: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if(loginValues.signType !== ''){
      loginRequest({
        email: loginValues.email,
        password: ''
      },loginValues.signType)
    }
  }, [loginValues]);
  
  const [passwordSituation, setPasswordSituation] = useState({
    src : '/assest/img/InputIcons/closePassword.svg',
    type : 'password'
  })
  const changePasswordSituation = () => {
    if(passwordSituation.src === '/assest/img/InputIcons/closePassword.svg'){
      setPasswordSituation({
        src : '/assest/img/InputIcons/openPassword.svg',
        type : 'text'
      })
    }else{
      setPasswordSituation({
        src : '/assest/img/InputIcons/closePassword.svg',
        type : 'password'
      })
    }
  }
  return (
    <>
    {isLoggining ? (
        <Loader title='Giriş Yapılıyor..'/>
    ) : (
      <>
      <Header/>
      <div className="loginBox">
        <h1>Giriş Yap</h1>
        <form>
          <input type='email' name='email' className='email'onChange={handleChange} placeholder='Email Adresinizi Giriniz'/>
          <div className="passwordArea">
            <input type={passwordSituation.type} name='password' className='password' onChange={handleChange} placeholder='Şifrenizi Giriniz'/>
            <img src={passwordSituation.src} alt='Şifre Durumunu Değiştir' onClick={changePasswordSituation}/>
          </div>
          {loginError.state ? (
            <>
            <div id='error'>
              <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
              <span>Giriş İşlemi Başarısız</span>
            </div>
            </>
          ) : (
            <></>
          )}
          <button type='submit' onClick={handleLogin}>Giriş Yap</button>
        </form>
        <span id='forgetPass'> Eğer şifrenizi unuttuysanız, <Link to={'/forgetPassword'}>Şifremi Unuttum</Link> 'a tıklayın.</span>
        <span id='politicy'>Siteye giriş yaparak, <Link to={'/ourPolicy'}>kullanım politikalarımızı</Link> kabul etmiş olursunuz.</span>
        <span id='other'>Diğer Giriş Yapma Yolları</span>
        <div className="others">
          <div className="googleLogin">
            <button className='googleButton' onClick={login}>
              <img src='/assest/img/ButtonIcons/GoogleLogo.svg' alt='Google Görseli'/>
              <span>Google ile Giriş Yap</span>
            </button>
          </div>
        </div>
        
      </div>
        
      </>
      
    )}
      
    </>
  )
}

export default Login
