import React from 'react'
import { useState,useEffect } from 'react';
import axios from "axios"
import { useGoogleLogin } from '@react-oauth/google';
import CryptoJS from 'crypto-js'

import './Register.css'
import './block/provinceSchoolAndEduBlock.css'

import provinceData from './../../../app/JSON/province.json'
import schoolData from './../../../app/JSON/schools.json'

import Loader from './../../partials/PartialLoader/Loader'
import Header from './../../partials/PartialHeader/Header'

import { routes } from '../../../Router';

const Register = () => {
    
    const [isRegistering, setIsRegistering] = useState(false)
    
    const cookieFunc = (username,signType = userValues.signType) => {
        const secretKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
        const encryptedUsername = CryptoJS.AES.encrypt(username.replace(" ", "_"), secretKey)
        const encryptedrealName = CryptoJS.AES.encrypt(username, secretKey)
        const encryptedSignType = CryptoJS.AES.encrypt(signType, secretKey)

        const temporary = {
          username: encryptedUsername.toString() + '.' + secretKey,
          realName: encryptedrealName.toString(),
          signType: encryptedSignType.toString()
        }
        window.sessionStorage.setItem('encrypted_credential',JSON.stringify(temporary))
        uploadScreen(false)
        window.open('/register/complete','_self')
    }

    const [userValues, setUserValues] = useState({
      username : '',
      email : '',
      password : '',
      school : '',
      userEducation : '',
      userPython : 'unknowed',
      userProvince : '',
      signType : 'Email'
    })
    const [googleValues, setGoogleValues] = useState({
      username:'',
      email:'',
      pictureSrc:'',
      signType : 'Google'
    })
    const [usernameError, setUsernameError] = useState(false)
    const usernameControl = (uValue) => {
      for (const routeKey in routes) {
        const route = routes[routeKey];
        if (uValue === (route.path.split('/')[1])) {
          setUsernameError(true);
          return;
        }
      }
      if(uValue.includes('/')){
        setUsernameError(true)
      }
      else{
        if(usernameError){
          setUsernameError(false)
        }
      }
    }
    const handleChange = (e) => {
      if(e.target.name === 'username'){
        usernameControl(e.target.value)
      }
      setUserValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const [botCheck, setBotCheck] = useState(0)

  const uploadScreen = (status) => setIsRegistering(status)

  const [errorValue, setErrorValue] = useState({
    error : false,
    errorText : ''
  })
  const errorStatus = (response) => {
    if(response.data.errorID === 2){
      setErrorValue({
        error : true,
        errorText : 'Kullanıcı adı müsait değil.'
      })
    }else{
      if(response.data.errorID === 3){
        setErrorValue({
          error : true,
          errorText : 'Şuanda isteğiniz çalıştırılamıyor.'
        })
      }else{
        setErrorValue({
          error : true,
          errorText : 'Email adresi müsait değil.'
        })
      }
    }
    uploadScreen(false)
  }
  const emailValidation = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      return false;
    } else {
      return true;
    }
  };
  
  const handleRegister = (e) => {
    e.preventDefault()
    if(
      userValues.email === '' || 
      userValues.password === '' || 
      userValues.school === '' || 
      userValues.userEducation === '' ||
      userValues.userProvince === '' ||
      userValues.username === ''
      ){
        setErrorValue({
          error : true,
          errorText : 'Tüm değerleri girmen gerekiyor.'
        })
      }
      else{
        if(!usernameError){   
          if(emailValidation(userValues.email)){
            uploadScreen(true)
            if(botCheck === 0){
                axios.post("/api/registerUser", {
                    ...userValues
                }).then((response) => {
                  if(response.data.status === 1){
                    cookieFunc(`${userValues.username}`,userValues.signType)
                  }else{
                    errorStatus(response)
                  }
                })
                .catch((err) => { console.error(err)})
          
                setBotCheck(5)
              }
          }
          else{
            setErrorValue({
              error : true,
              errorText : 'Geçerli bir email gir.'
            })
          }
          
        }
      }
    
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setBotCheck(botCheck => botCheck - 1);
    }, 1000);

    if (botCheck === 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [botCheck]);
  
  useEffect(() => {
    if(googleValues.email !== ''){
    uploadScreen(true)
      axios.post("/api/registerUser", {
        
          ...googleValues
      }).then((response) => {
        if(response.data.status === 1){
          cookieFunc(`${googleValues.username}`,googleValues.signType)
        }else{
          errorStatus(response)
        }
      })
      .catch((err) => { console.error(err)})
    }
  }, [googleValues]);
  const  register  = useGoogleLogin({
    onSuccess: (response) => {
      
      if(response.access_token){
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`)
        .then((response) => response.json())
        .then((userData) => {
          setGoogleValues(prevState => ({
            ...prevState,
            username: userData.name,
            email: userData.email,
            pictureSrc: userData.picture
          }));
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
  const [educationMenu, setEducationMenu] = useState(false)
  const [forSchoolValues, setForSchoolValues] = useState({
    IsOkeyProvince : false,
    IsOkeyEducation : false
  })
  const [filteredProvinces, setFilteredProvinces] = useState({
    values : [],
    state : false
  })
  const [filteredSchools, setFilteredSchools] = useState({
    values : [],
    state : false
  })
  const handleChangeProvince = (e) => {
    setUserValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    let temporaryList = []
    Object.values(provinceData).forEach((value) => {
      if (value.toLowerCase().startsWith(e.target.value.toLowerCase())) {
        temporaryList.push(value)
      }
    });
    if(temporaryList.length !== 0){
      if(temporaryList.length !== 81){
        setFilteredProvinces({
          values : temporaryList,
          state : true
        })
      }else{
        setFilteredProvinces({
          values : temporaryList,
          state : false
        })
      }
    }else{
      setFilteredProvinces({
        values : temporaryList,
        state : false
      })
    }
  };
  const changeProvince = (e) => {
    setUserValues((prev) => ({ ...prev, userProvince: e.target.dataset.value }))
    setFilteredProvinces({
      values : [],
      state : false
    })
    setForSchoolValues(prevState => ({
      ...prevState,
      IsOkeyProvince: true
    }));
    
  }
  const handleChangeSchool = (e) => {
    setUserValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    let temporaryList = []
    let schoolList;
    const allProvinceSchools = schoolData[userValues.userProvince][0]
    if(parseInt(userValues.userEducation) < 5){
      schoolList = allProvinceSchools['İlkokul']
      Object.values(schoolList).forEach((value) => {
        let temporaryValue = value['OKULADI']
        if (temporaryValue.toLowerCase().startsWith(' ' + e.target.value.toLowerCase())) {
          temporaryList.push(temporaryValue)
        }
      });
    }else if(parseInt(userValues.userEducation) < 9 && parseInt(userValues.userEducation) > 4){
      schoolList = allProvinceSchools['Ortaokul']
      Object.values(schoolList).forEach((value) => {
        let temporaryValue = value['OKULADI']
        if (temporaryValue.toLowerCase().startsWith(' ' + e.target.value.toLowerCase())) {
          temporaryList.push(temporaryValue)
        }
      });
    }else{
      schoolList = allProvinceSchools['Lise']
      Object.values(schoolList).forEach((value) => {
        let temporaryValue = value['OKULADI']
        if (temporaryValue.toLowerCase().startsWith(' ' + e.target.value.toLowerCase())) {
          temporaryList.push(temporaryValue)
        }
      });
    }
    
    if(temporaryList.length !== 0){
        setFilteredSchools({
          values : temporaryList,
          state : true
        })
    }else{
      setFilteredSchools({
        values : temporaryList,
        state : false
      })
    }
  }
  const changeSchool = (e) => {
    setUserValues((prev) => ({ ...prev, school: e.target.dataset.value }))
    setFilteredSchools({
      values : [],
      state : false
    })
    setForSchoolValues({
      IsOkeyProvince : true
    })
  }
  const handleEduChange = (e) => {
    setEducationMenu(false)
    setUserValues(prevState => ({
      ...prevState,
      userEducation : e.target.dataset.value
    }));
    
    if(e.target.dataset.value === '13'){
      setForSchoolValues(prevState => ({
        ...prevState,
        IsOkeyEducation: false
      }));
    }else{
      setForSchoolValues(prevState => ({
        ...prevState,
        IsOkeyEducation: true
      }));

    }
    
  }
  return (
    <>
      {isRegistering ? (
        <Loader title='Kaydını işlemeye çalışıyoruz..'/>
      ) : (
        <>
          <Header/>
          <div className="registerBox">
            <h1>Kayıt Ol</h1>
          <form>
            <input type='text' name='username' className='username' id='input-text' onChange={handleChange} placeholder='İsminizi Giriniz'/>
            <span id='seeName'>Görülecek kullanıcı adın şu şekilde olacak <span>@{userValues.username.replace(" ","_")}</span></span>
            {usernameError ? (
              <>
              <div id='error'>
                <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
                <span>Geçersiz Kullanıcı Adı</span>
              </div>
              </>
            ) : (
              <></>
            )}
            <input type='email'name='email' className='email' id='input-text' onChange={handleChange} placeholder='Email Adresinizi Giriniz'/>

            <div className="passwordArea">
              <input type={passwordSituation.type} name='password' className='password' id='input-pass' onChange={handleChange} placeholder='Şifrenizi Giriniz'/>
              <img src={passwordSituation.src} alt='Şifre Durumunu Değiştir' onClick={changePasswordSituation}/>
            </div>

            <div className="province">
              <input type='text' name='userProvince' className='userProvince' value={userValues.userProvince} id='input-text' onChange={handleChangeProvince} placeholder='İlinizi Giriniz' autoComplete='off'/>
                {filteredProvinces.state ? (
                <div className='optionsProvince'>
                  {filteredProvinces.values.map((index, key) => (
                    <div key={key} data-value={index} className='option' onClick={changeProvince}>
                      {index}
                    </div>
                  ))}
                  </div>
                ) : (
                  <></>
                )}
            </div>
            <div className="eduArea">
              <div className='educationLevel' onClick={()=>setEducationMenu(true)}>{forSchoolValues.IsOkeyEducation ? (<>{userValues.userEducation}</>) : (<>Eğitim Seviyenizi Giriniz</>)}</div>
              {educationMenu ? (
                <div className="menuEdu">
                  <div className="primary">
                    <span>İlkokul</span>
                    <div className="optionsEdu">
                      <div className="option" data-value='1' onClick={handleEduChange}>1</div>
                      <div className="option" data-value='2' onClick={handleEduChange}>2</div>
                      <div className="option" data-value='3' onClick={handleEduChange}>3</div>
                      <div className="option" data-value='4' onClick={handleEduChange}>4</div>
                    </div>
                  </div>
                  <div className="medium">
                    <span>Ortaokul</span>
                    <div className="optionsEdu">
                      <div className="option" data-value='5' onClick={handleEduChange}>5</div>
                      <div className="option" data-value='6' onClick={handleEduChange}>6</div>
                      <div className="option" data-value='7' onClick={handleEduChange}>7</div>
                      <div className="option" data-value='8' onClick={handleEduChange}>8</div>
                    </div>

                  </div>
                  <div className="high">
                    <span>Lise</span>
                    <div className="optionsEdu">
                      <div className="option" data-value='9' onClick={handleEduChange}>9</div>
                      <div className="option" data-value='10' onClick={handleEduChange}>10</div>
                      <div className="option" data-value='11' onClick={handleEduChange}>11</div>
                      <div className="option" data-value='12' onClick={handleEduChange}>12</div>
                    </div>
                  </div>
                  <div className="graduate">
                    <span>Mezun</span>
                    <div className="optionsEdu">
                      <div className="option" data-value='13' onClick={handleEduChange}>Mezun</div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>

            {
              forSchoolValues.IsOkeyEducation && forSchoolValues.IsOkeyProvince ? (
                <div className="school">
                  <input type='text' name='school' className='school' value={userValues.school} id='input-text' onChange={handleChangeSchool} placeholder='Okulunuzu Giriniz' autoComplete='off'/>
                    {filteredSchools.state ? (
                    <div className='optionsSchool'>
                      {filteredSchools.values.map((index, key) => (
                        <div key={key} data-value={index} className='option' onClick={changeSchool}>
                          {index}
                        </div>
                      ))}
                      </div>
                    ) : (
                      <></>
                    )}
                </div>
              ) : (
                <></>
              )
            }
            {errorValue.error ? (
              <>
              <div id='error'>
                <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
                <span>Hata : {errorValue.errorText}</span>
              </div>
              </>
            ) : (
              <></>
            )}
            <button type='submit' onClick={handleRegister}>Kayıt Ol</button>
          </form>

            <span id='other'>Diğer Kayıt Olma Yolları</span>
            <div className="others">
            <div className="googleRegister">
              <button className='googleButton' onClick={register}>
                <img src='/assest/img/ButtonIcons/GoogleLogo.svg' alt='Google Görseli'/>
                <span>Google ile Kayıt Ol</span>
              </button>
            </div>
            </div>
          </div>
        </>
      )}
    </>
    
  )
}

export default Register
