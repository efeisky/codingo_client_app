import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEffect,useState,useRef } from 'react';
import { decrypt } from '../getUserPages';
import Loader from '../../../partials/PartialLoader/Loader';
import Header from '../../../partials/PartialHeader/Header';
import './Setting.css'
import axios from 'axios';
import Theme from '../../../partials/user/setting/theme';
const Setting = () => {

    const {usernameParam} = useParams()
    let isAuth=false;
    const [isUploading, setIsUploading] = useState({
      state : true,
      title : 'Bilgilerin Getiriliyor..'
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

    const [user, setUser] = useState({
      rn: '',
      un: '',
      school: '',
      src: '',
      score: 0,
      eduLevel: '',
      province: '',
      v: 0,
      pn: '',
      pv: 0,
      bt : '',
      btc : ''
    })
    const [deletePopup, setDeletePopup] = useState({
      popupState : false
    })
    const [deleteUsernameValue, setDeleteUsernameValue] = useState('')
    const [error, setError] = useState('')
    const setUserData = async(username) => {
      const value = await axios.get('/getSetting',{
        params : {
          name : username
        }
      })
      if(value.data.status){
        setUser({...value.data.result})
        setIsUploading({
          state : false
        })
      }else{
        console.error('Sistemsel bir hata oluştu..')
      }
    }
    useEffect(() => {
      setUserData(plainUsername)
    }, [])
    
    const [menuVisible, setMenuVisible] = useState(false);
    const pictureRef = useRef(null)
    
    function handleContextMenu(e) {
      e.preventDefault();
      setMenuVisible(true)
      pictureRef.current.style.top = `${e.pageY}px`
      pictureRef.current.style.left = `${e.pageX}px`
      
    }
    const clickMenu = (e) => {e.preventDefault()}
    const deletePicture = async() => {
      const deleteData = await axios.delete('/imageActions',{
        params : {
          name : plainUsername,
          type : 'delete'
        }
      });
      if(!deleteData.data.postStatus){
        alert('Hata oluştu. Sonra tekrar deneyiniz.')
      }
      window.open(`/${plainUsername}`,'_self')
    }
    const changePassword = () => {
      window.open('setting/changePassword','_self')
    }
    const quitAccount = () => {
      window.open('/','_self')
      window.localStorage.clear()
    }
    const deleteAccount = () => {
      setDeletePopup({popupState : true})
    }
    const handleInputChange = (e) => {
      setDeleteUsernameValue(e.target.value)
    };
  
    const deleteAccountWithVerification = async() => {
      if(user.un === deleteUsernameValue){
        setIsUploading({state : true, title : 'Hesabın Siliniyor..'})
        const deleteReq = await axios.delete('/deleteAccount',{
          params : {
            name : deleteUsernameValue
          }
        })
        if(deleteReq.data.deleteStatus){
          setIsUploading({state : false})
          quitAccount()
        }else{
          alert('Bir hata oluştu.. Lütfen sonra tekrar deneyiniz.')
        }
      }else{
        setError('Yanlış Kullanıcı Adı Girildi')
      }
    }
  return (
    
    <div className='setting'>
      {isAuth ? (
        <>
        {isUploading.state ? (
            <Loader title={isUploading.title}/>
        ) : (
          <>
          <Header/>
          {!user.v ? (
            <div className="verifyAccount">
              <img 
              src="/assest/img/userIcons/setting_warn.svg"
              alt="Hesabı Doğrula" 
              id="verifyImg" 
              />
              <div id="text">
                <span>Email hesabınız doğrulanmamış gözüküyor..</span>
                <Link to={`/${plainUsername}/setting/verify`}>Hesabı Doğrula</Link>
              </div>
            </div>
          ) : (
            <></> 
          )}
          
          <div className="topInfos">
            <div className="profile-picture" >
              <img 
                  src={user.src}
                  securitypolicy='restricted'
                  alt='Profile Resmi'
                  referrerPolicy='no-referrer'
                  id='profilePicture'
                  onContextMenu={handleContextMenu}
              />
                <div className="right-click-menu" ref={pictureRef} style={{display : menuVisible ? ('flex') : ('none')}} onContextMenu={clickMenu}>
                  {user.src === '/assest/img/userIcons/unknown.png' ? (
                    <Link to={`/${plainUsername}/setting/picture?type=add`}>Resim Ekle</Link>
                  ) : (
                    <>
                      <Link to={`${user.src}`} target='_blank'>Resmini Görüntüle</Link>
                      <Link to={`/${plainUsername}/setting/picture?type=change`}>Resmi Değiştir</Link>
                      <div onClick={deletePicture}>Resmi Sil</div>
                    </>
                  )}
                </div>
            </div>
            <div className="name">
              <div className='nameOpt' id="realname">
                <span id='feature'>İsim</span>
                <span>{user.rn}</span>
                </div>
              <div className='nameOpt' id="username">
                <span id='feature'>Kullanıcı İsmi</span>
                <span>@{user.un}</span>
                </div>
              <div className='nameOpt' id="score">
                  <img 
                    src={'/assest/img/userIcons/Score.svg'}
                    securitypolicy='restricted'
                    alt='Profile Resmi'
                    crossOrigin='anonymous'
                    referrerPolicy='no-referrer'
                  />
                  <span>{user.score} Puan</span>
              </div>
            </div>
          </div>
          <div className="profileInfos">
            <h1>Profil Bilgileri</h1>
            <div className="school" id='featureDiv'>
                <span id='feature'>Okulum</span>
                <span>{user.school}</span>
            </div>
            <div className="eduLevel" id='featureDiv'>
                <span id='feature'>Sınıfım</span>
                <span>{user.eduLevel}. Sınıf</span>
            </div>
            <div className="province" id='featureDiv'>
                <span id='feature'>Yaşadığım Şehir</span>
                <span>{user.province}</span>
            </div>
          </div>
          <div className="securityInfos" >
          <h1>Güvenlik Bilgileri</h1> 
            <div className="verified" id='featureDiv'>
                <span id='feature'>Hesap Doğruluğu</span>
                {user.v ? (
                <div>
                  <img src='/assest/img/GeneralIcons/shieldDone.svg'/>
                  <span>Doğrulandı</span>
                </div>

                ) : (
                  <div>
                    <img src='/assest/img/GeneralIcons/shieldFail.svg'/>
                    <span>Doğrulanmadı</span>
                  </div>
                )}
            </div>
            <div className="phoneNumber" id='featureDiv'>
                <span id='feature'>Telefon Numarası</span>
                <span>{user.pn ? (user.pn) : ('Bulunamadı')}</span>
            </div>
            <div className="phoneVerified" id='featureDiv'>
            <span id='feature'>Telefon Numarası Doğruluğu</span>
                {user.pv ? (
                <div>
                  <img src='/assest/img/GeneralIcons/shieldDone.svg'/>
                  <span>Doğrulandı</span>
                </div>

                ) : (
                  <div>
                    <img src='/assest/img/GeneralIcons/shieldFail.svg'/>
                    <span>Doğrulanmadı</span>
                  </div>
                )}
            </div>
          </div>
          <div className="themeInfos">
            <h1>Tema Bilgileri</h1>
            <Theme username={plainUsername} title={user.bt} content={user.btc}/>
          </div>
          <div className="dangeredZone">
            <h1 id='danger'>Tehlikeli Bölge</h1>
            <span>Bu siteye üye olarak, tüm politikalarımız kabul etmiş bulunmaktasınız. Bu politikalara <Link to={'/ourPolicy'}>Politikarımız</Link>'dan ulaşabilirsiniz.</span>
            
            <button id='event' onClick={changePassword}>Şifremi Değiştir</button>
            <button id='event' onClick={quitAccount}>Hesaptan Çıkış Yap</button>        
            <button id='event' onClick={deleteAccount}>Hesabımı Sil</button>        
          </div>
          {deletePopup.popupState ? (
            <div className='popupBack'>
              <div className="popup">
                <h1>Hesabı Sil</h1>
                <span>Aşağıya kullanıcı adınızı giriniz</span>
                <input 
                type='text' 
                placeholder='Kullanıcı Adınız'
                value={deleteUsernameValue} 
                onChange={handleInputChange} />
                {error ? (
                  <div id='error'>
                    <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
                    <span>{error}</span>
                  </div>
                ) : (
                  <></>
                )}
                <button onClick={deleteAccountWithVerification}>İşlemi Onayla</button>
              </div>
            </div>
          ) : (
            <></>
          )}
          </>
          
        )}
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Setting