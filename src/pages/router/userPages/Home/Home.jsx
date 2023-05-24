import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEffect,useState } from 'react';
import { decrypt } from '../getUserPages';
import CryptoJS from 'crypto-js'

import Loader from '../../../partials/PartialLoader/Loader';
import ShowLesson from '../../../partials/user/mainpage/ShowLesson';

import './Home.css'
import Header from '../../../partials/PartialHeader/Header';
import axios from 'axios';
const Home = () => {
    const {usernameParam} = useParams()
    let isAuth=false;
    const [isUploading, setIsUploading] = useState(true)
    const [lessonData, setLessonData] = useState({
      mathNumber : 0,
      mathSubject : '',
      pythonNumber : 0,
      pythonSubject : '',
      userPython : '',
      userClass : ''
    })
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

    const cookieFunc = (username) => {
      const secretKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
      const encryptedUsername = CryptoJS.AES.encrypt(username.replace(" ", "_"), secretKey)
      const encryptedrealName = CryptoJS.AES.encrypt(username, secretKey)
      const encryptedSignType = CryptoJS.AES.encrypt('Google', secretKey)

      const temporary = {
        username: encryptedUsername.toString() + '.' + secretKey,
        realName: encryptedrealName.toString(),
        signType: encryptedSignType.toString()
      }
      window.sessionStorage.setItem('encrypted_credential',JSON.stringify(temporary))
      setIsUploading(false)
      window.open('/register/complete','_self')
  }

    const setData = async () => {
      const reqData = await axios.get('/api/getUserMainpage',{
        params : {
          username : plainUsername
        }
      })
      if (!reqData.data.userCompleted) {
        cookieFunc(plainUsername)
      }
      setLessonData({...reqData.data.lessonDatas})
      setIsUploading(false)
    }
    useEffect(() => {
      setData()
    }, [])
    
  return (
    <div className='home-area'>
      {isAuth ? (
        <>
        {
          isUploading ? (
            <Loader title='Hesaplamalar Yapılıyor..'/>
          ) : (
            <>
              <Header/>
              <ShowLesson lesson='math' activeLessonNo={lessonData.mathNumber} lessonClass={lessonData.userClass} lessonSubject={lessonData.mathSubject}/>
              {lessonData.userPython === 'unknowed' ? (
                <div className='pythonTest'>
                  <h1>Python derslerine girmeden önce seviyene öğrenmemiz gerekmektedir.</h1>
                  <Link 
                  to={`/pythonTest?username=${plainUsername}&auth=${1}&vir=${JSON.parse(window.localStorage.getItem('token_profile')).secretUsername,secretKey}`}
                  >
                    <button>Seviye Testine Gir</button>
                  </Link>
                </div>
              ) : (
                <ShowLesson lesson='python' activeLessonNo={lessonData.pythonNumber} lessonClass={'_virPython'} lessonSubject={lessonData.pythonSubject}/>
              )}
              
              
            </>
          )
        }
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Home
