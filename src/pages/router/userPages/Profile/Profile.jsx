import React,{useEffect,useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import axios from 'axios';
import { decrypt } from '../getUserPages';
import './Profile.css'

import Loader from './../../../partials/PartialLoader/Loader'
import HeaderProfile from '../../../partials/profile/header';
import Header from '../../../partials/PartialHeader/Header';
import ActionButton from '../../../partials/profile/ActionButton';
import Biography from '../../../partials/profile/Biography';
import Score from '../../../partials/profile/Score';
import { Follower } from '../../../partials/profile/Follower';

const Profile = () => {
  let isAuth = false;
  let secretKey,plainUsername;
    try {
      const localData = JSON.parse(window.localStorage.getItem('token_profile'));
      secretKey = localData.authProperty;
      plainUsername = decrypt(localData.secretUsername,secretKey)
      isAuth = true;
    } catch (err) {
    }
  const [profileValues, setProfileValues] = useState({
    realName : '',
    username : '',
    school : '',
    province : '',
    picture : '',
    score : '',
    eduLevel : '',
    pythonLevel : '',
    mathLessonNo : '',
    pythonLessonNo : '',
    biographyTitle : '',
    biographyContent : '',
    likeCount : '',
    orderInSchool : '',
    orderInProvince : '',
    lastTenDayScore : '',
    follower : 0,
    followed : 0,
    security : 0

  })
  const [isUploading, setIsUploading] = useState(true)
  const [isNotFounded, setIsNotFounded] = useState(false)
  const location = useLocation()
  const url = window.location.origin + decodeURIComponent(location.pathname)
  useEffect(() => {
    const urlLog = window.location.href;
    const regex = /\/([^\/]+)\/profile/;
    const match = urlLog.match(regex);
    const username = match[1]
    axios.get('/profileByUsername',{
      params: {
        username : decodeURIComponent(username)
      }
    })
    .then((res)=> {
      const data = res.data.formattedData;
      setIsUploading(false)
      if(res.data.processResult === 1){
        if(data === 'Unknown User'){
          setIsNotFounded(true)
        }else{
          setProfileValues(data)
        }
      }else{
        console.log('Bir hata oluştu. Lütfen sonra deneyiniz')
      }
    })
  }, [])
  
  return (
    <>
      {isUploading ? (
        <Loader title={'Profil Açılıyor..'}/>
      ) : (
        <>
        <Header/>
        {
          isNotFounded ? (
            <div className='notFound'>
              <img src='/assest/img/GeneralIcons/profile_NotFound.svg' alt='Uyarı Resmi'/>
              <h1>Bu kişi bulunamadı !</h1>
              <Link to={'/searchProfile'}><button className='lookProfile'>Diğer Profillere Bak</button></Link>
              <Link to={'/register'}><button className='beRegister'>Bu Profil Senin Olsun</button></Link>      
            </div>
          ) : (
            <>
              <HeaderProfile 
                pictureNameAndSecure={{
                  pictureSrc: (profileValues.picture === '' ? ('/assest/img/userIcons/unknown.png') : (profileValues.picture)),
                  pictureShape: false,
                  pictureSize: 150,
                  realName: profileValues.realName,
                  userName: profileValues.username,
                  secureStatus: profileValues.security
                }}
                qrCode={{
                  isPhone: false,
                  url,
                  qrSize: 150
                }}
              />
              <Follower username={profileValues.username} follower={profileValues.follower} followed={profileValues.followed}/>
              <ActionButton {...profileValues} activeUsername={plainUsername}/>
              <Biography title={profileValues.biographyTitle} content={profileValues.biographyContent}/>
              <div className="scoreArea">
                <Score scoreText={`${profileValues.score} puan`} imageSrc={'/assest/img/ScoreIcons/Score.svg'}/>
                <Score scoreText={`${profileValues.likeCount} beğeni`} imageSrc={'/assest/img/ScoreIcons/LikeCount.svg'}/>
                {parseInt(profileValues.eduLevel) <= 12 ? (
                  <Score scoreText={`${profileValues.school} içinde ${profileValues.orderInSchool}. Sırada`} imageSrc={'/assest/img/ScoreIcons/ChartYellow.svg'}/>
                ) : (
                  <></>
                )}
                <Score scoreText={`${profileValues.province.charAt(0) + profileValues.province.slice(1).toLowerCase()} ilinde ${profileValues.orderInProvince}. Sırada`} imageSrc={'/assest/img/ScoreIcons/ChartPurple.svg'}/>
                <Score scoreText={`Son 10 günde ${profileValues.lastTenDayScore} puan`} imageSrc={'/assest/img/ScoreIcons/Activity.svg'}/>
              </div>
            </>
          )
        }
        
      </>
      )}

      
    </>
  )
}


export default Profile