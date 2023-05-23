import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect,useState } from 'react';
import { decrypt } from '../getUserPages';
import Loader from '../../../partials/PartialLoader/Loader';
import axios from 'axios';
import NotPartial from '../../../partials/user/nots/notPartial';
import Header from '../../../partials/PartialHeader/Header';
import './Nots.css'
const Nots = () => {

    const {usernameParam} = useParams()
    let isAuth=false;
    const [isUploading, setIsUploading] = useState(true)

    const [nots, setNots] = useState([])
    const [isEmpty, setIsEmpty] = useState(false)
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

    const setData = async ( ) => {
      const reqData = await axios.get('/getNots',{
        params:{
          username : plainUsername
        }
      })
      if(reqData.data.status){
        setIsUploading(false)
        setNots([...reqData.data.result])
      }else{

      }
    }
    useEffect(() => {
      setData()
    }, [])
    
    
  return (
    <>
    {isAuth ? (
      <>
      {isUploading ? (
          <Loader title='Bilgilerin Getiriliyor..'/>
      ) : (
        <>
          <Header/>
          <div className="nots">
            <h1 id='header'>Ders Notlarım</h1>
            
            {nots.length !== 0 ? (
              <div className="notsFlex">
                {nots.map((index, key) => (
                  <NotPartial key={key} content={index.Content} date={index.Date} />
                ))}
              </div>
            ) : (
              <div className='notFoundNotes'>
                <img src='/assest/img/GeneralIcons/profile_NotFound.svg' alt='Uyarı Resmi' />
                <h1>Hiç not bulunamadı!</h1>  
              </div>
            )}

          </div>
        </>
      )}
      </>
    ) : (
      <></>
    )}
  </>
  )
}

export default Nots