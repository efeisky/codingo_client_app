import React from 'react'
import { useState,useEffect } from 'react';
import CryptoJS from 'crypto-js';
import Loader from './../../partials/PartialLoader/Loader'

import provinceData from './../../../app/JSON/province.json'
import schoolData from './../../../app/JSON/schools.json'

import './RegisterComplete.css'
import './block/provinceSchoolAndEduBlock.css'
const RegisterComplete = () => {

  const [isRegistering,setIsRegistering] = useState(false)
  const [plainUsername, setPlainUsername] = useState('')
  const [plainRealName, setPlainRealName] = useState('')
  const [plainsignType, setPlainsignType] = useState('')

  const decrypt = (cipherText,key) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  useEffect(() => {
    
    const data = JSON.parse(window.sessionStorage.getItem('encrypted_credential'));
    const secretKey = data.username.split('.')[1]
    
    setPlainUsername(decrypt(data.username.split('.')[0],secretKey))
    setPlainRealName(decrypt(data.realName,secretKey))
    setPlainsignType(decrypt(data.signType,secretKey))
  }, [])
  

  const [values, setValues] = useState({
    password : '',
    school : '',
    userEducation : '',
    userPython : '',
    userProvince : '',
    pictureSrc : '',
    signType : plainsignType
  })

  const handleChange = (e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const [file, setFile] = useState(null)

  const createTokenProfile = (username) => {
    setIsRegistering(true)
    const secretUserKey = CryptoJS.lib.WordArray.random(2048).toString(CryptoJS.enc.Hex);
    const secretUsername = CryptoJS.AES.encrypt(username.replace(" ", "_"), secretUserKey);
    const auth = CryptoJS.AES.encrypt(secretUsername.toString() + '.' + CryptoJS.AES.encrypt('access-provider-auth-connect', secretUserKey) + CryptoJS.lib.WordArray.random(1024).toString(CryptoJS.enc.Hex),secretUserKey);

    const token = {
      secretUsername: secretUsername.toString(),
      authConnect: auth.toString(),
      authProperty: secretUserKey.toString(),
      authStatus: 1
    }
    window.localStorage.setItem('token_profile',JSON.stringify(token))
    setIsRegistering(false)
    window.open(`/${username.replace(" ", "_")}`,'_self')
    window.sessionStorage.removeItem('encrypted_credential')
  }

  const skipComplete = (e) => {
    e.preventDefault()
    createTokenProfile(plainUsername)
  }
  const skipCompletePass = (e) => {
    setValues({
      password : ''
    })
    e.preventDefault()
    finishComplete(e)
    createTokenProfile(plainUsername)
  }
  const finishComplete = async(e) => {
    e.preventDefault()
    setIsRegistering(true)
    let formData = new FormData();
    if(values.signType === 'Email'){
      
      formData.append('file', file)
      formData.append('username',plainUsername)
      formData.append('signType',plainsignType)
      fetch('/completeRegister', {
          method: "PUT",
          body: formData
      })
      .then((res) => res.json())
      .then((response) => {
        setIsRegistering(false)
        if(response.apiStatus === true && response.changedValues === true){
          createTokenProfile(plainUsername)
        }else{
          console.error('İşlem gerçekleştirilemiyor.')
        }
      })
      .catch((err) => console.error(err));

    }else{
      formData.append('values',JSON.stringify(values))
      formData.append('username',plainUsername)
      formData.append('signType',plainsignType)
      fetch('/completeRegister', {
          method: "PUT",
          body: formData
      })
      .then((res) => res.json())
      .then((response) => {
        setIsRegistering(false)
        if(response.apiStatus === true && response.changedValues === true){
          createTokenProfile(plainUsername)
        }else{
          console.error('İşlem gerçekleştirilemiyor.')
        }
      })
      .catch((err) => console.error(err));
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }
  
  const [page, setPage] = useState(1)

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
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
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
    setValues((prev) => ({ ...prev, ['userProvince']: e.target.dataset.value }))
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
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    let temporaryList = []
    let schoolList;

    const allProvinceSchools = schoolData[values.userProvince][0]
    if(parseInt(values.userEducation) < 5){
      schoolList = allProvinceSchools['İlkokul']
      Object.values(schoolList).forEach((value) => {
        let temporaryValue = value['OKULADI']
        if (temporaryValue.toLowerCase().startsWith(' ' + e.target.value.toLowerCase())) {
          temporaryList.push(temporaryValue)
        }
      });
    }else if(parseInt(values.userEducation) < 9 && parseInt(values.userEducation) > 4){
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
    setValues((prev) => ({ ...prev, ['school']: e.target.dataset.value }))
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
    setValues(prevState => ({
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
      <Loader title='Son işlemler yapılıyor..'/>
    ) 
    : 
    (
    <div className='completeArea'>
    { plainsignType === 'Email' ? (
      <>
        <h1>Çok az kaldı.. <span className="greeting">{plainRealName}</span></h1>
        <form onSubmit={finishComplete}>
          <span>İstersen profil resmi ekleyebilirsin</span>
          <input type='file' onChange={handleFileChange}/>
          <button type='submit' className='finishButton' >Profil Resmini Ekle</button>
        </form>
        <button type='submit' className='passProcessButton' onClick={skipComplete}>Şimdilik Geç</button>
      </>
    ) : (
      <div>
        <h1>Son düzenlemeler.. <span className="greeting">{plainRealName}</span></h1>
      <form>
        {page === 1 ? (
          <>
            <div className="province">
              <input type='text' name='userProvince' className='userProvince' value={values.userProvince} id='input-text' onChange={handleChangeProvince} placeholder='İlinizi Giriniz' autoComplete='off'/>
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
              <div className='educationLevel' onClick={()=>setEducationMenu(true)}>{forSchoolValues.IsOkeyEducation ? (<>{values.userEducation}</>) : (<>Eğitim Seviyenizi Giriniz</>)}</div>
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
                  <input type='text' name='school' className='school' value={values.school} id='input-text' onChange={handleChangeSchool} placeholder='Okulunuzu Giriniz' autoComplete='off'/>
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
            
            <button id='nextPage' className='passProcessButton'  onClick={()=>setPage(page + 1)}>Sonraki Sayfaya Geç</button>
          </>
        ) : (
          <></>
        )}
        {page === 2 ? (
          <>
          <span>Şifre eklemek, sonrasında hesabın kaybolması durumunda yardımcı olur.</span> 
          <div className="passwordArea">
              <input type={passwordSituation.type} name='password' className='password' id='input-pass' onChange={handleChange} placeholder='Şifrenizi Giriniz'/>
              <img src={passwordSituation.src} alt='Şifre Durumunu Değiştir' onClick={changePasswordSituation}/>
            </div>
          <button className='passProcessButton'  onClick={skipCompletePass}>Şifreyi Geç {'(Şifre kaydedilecektir)'}</button>
  
          <button type='submit' className='finishButton' onClick={finishComplete}>Değişiklikleri Kaydet</button>

          </>
        ) : (
          <></>
        )}

        
      </form>
        
        <h4>Sayfa <span className="activePage">{page} / 2</span>  </h4>
      </div>

    )}
    </div>
    )}
    </>
    
  )
}

export default RegisterComplete