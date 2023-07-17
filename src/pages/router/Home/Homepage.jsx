import React from 'react'
import './homepage.css'
import { decrypt } from '../userPages/getUserPages'

import { useEffect,useState } from 'react'
import Header from './../../partials/PartialHeader/Header'

const Homepage = () => {

  let isAuth = false;
  let secretKey,plainUsername;
    try {
      const localData = JSON.parse(window.localStorage.getItem('token_profile'));
      secretKey = localData.authProperty;
      plainUsername = decrypt(localData.secretUsername,secretKey)
      isAuth = true; 
    } catch (err) {
    }

    const registerEvent = () => {window.open('/register','_self')}
    const trialEvent = () => {window.open('/trial','_self')}
  
  return (
    <div className='page'>
      <Header/>
      <div className="darkArea">
        <h1>Codingo</h1>
        <p>Codingo ile bilgilerini güçlendir</p>
        <span>Son çıkan yapay zeka ürünleri ve makine öğrenmesi ile matematik ve python bilgilerini en iyi seviyeye çıkar !</span>
        <div className="buttons">
          <button id="trialButton" onClick={trialEvent}>Deneme Dersine Katıl</button>
          <button id="registerButton" onClick={registerEvent}>Kayıt Ol</button>
        </div>
      </div>
      <div className="imageAndTexts">
        <div>
          <span>İlkokul, Ortaokul, Lise ve eğitim hayatını sonlandırmış olan mezun kişiler için içeriğimizde bulundurduğumuz dersler ile kendimizi geliştirmeye çalışıyoruz.</span>
          <img 
          src='/assest/img/public/education.svg' 
          securitypolicy='restricted'
          alt='Eğitim Görseli'
          crossOrigin='anonymous'
          referrerPolicy='no-referrer'
          />
        </div>
        <div>
          <img 
            src='/assest/img/public/gpt.svg' 
            securitypolicy='restricted'
            alt='CHAT-GPT4 Görseli'
            crossOrigin='anonymous'
            referrerPolicy='no-referrer'
          />
          <span>Sorularımızı hazırlarken CHAT-GPT4 ile yardım alıyoruz. Bu sayede sizlere en kaliteli soruları ulaştırmaya çalışıyoruz.</span>
        </div>
        <div id='column'>
          <img 
            src='/assest/img/public/apk.svg' 
            securitypolicy='restricted'
            alt='CHAT-GPT4 Görseli'
            crossOrigin='anonymous'
            referrerPolicy='no-referrer'
          />
          <a href='/assest/file/codingo.apk' download>Codingo mobil uygulamasını indirmek için basınız.</a>
        </div>
      </div>
    </div>
  )
}

export default Homepage
