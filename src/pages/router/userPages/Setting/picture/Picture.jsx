import {useEffect,useState} from 'react'
import React from 'react'
import { useParams } from 'react-router-dom';
import { decrypt } from '../../getUserPages';
import "./Picture.css";
import axios from 'axios';
import Loader from './../../../../partials/PartialLoader/Loader'

export const Picture = () => {
  const {usernameParam} = useParams()
    let isAuth=false;
    const [isUploading, setIsUploading] = useState(false)
    let secretKey,plainUsername;
    try {
      const localData = JSON.parse(window.localStorage.getItem('token_profile'));
      secretKey = localData.authProperty;
      plainUsername = decrypt(localData.secretUsername,secretKey)
      if (plainUsername === usernameParam) { isAuth = true; } else { window.open(`/${plainUsername}`, '_self'); }
    } catch (err) {
      console.error(err)
      window.open(`/${usernameParam}`,'_self')
    }
    
    const [error, setError] = useState({
      status : false,
      text : ''
    })
    const [type, setType] = useState('')
    useEffect(() => {
      const url = new URL(window.location.href);
      setType(url.searchParams.get('type'))
    }, [])

    const [file, setFile] = useState(null)

    const handleFileChange = (e) => {
      setFile(e.target.files[0])
    }
    const addImage = async() => {
      if(file){
        let formData = new FormData();
        formData.append('file',file);
        setIsUploading(true)
        const postData = await axios.post('/imageActions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: {
            name : plainUsername,
            type: 'add'
          }
        });
        setIsUploading(false);
        if(postData.data.postStatus){
          window.open(`/${plainUsername}`,'_self')
        }else{
          switch (postData.data.errorID) {
            case 1:
              window.open(`/${plainUsername}/setting/picture?type=change`,'_self')
              break;

            case 2:
              setError({
                status : 1,
                text : 'Sistemsel bir hata oluştu..'
              })
              break;
            default:
              break;
          }
        }
      }else{
        setError({
          status : true,
          text : 'Resim Yüklemeniz Gerekmektedir.'
        })
      }
    }
    const editImage = async() => {
      if(file){
        let formData = new FormData();
        formData.append('file',file);
        setIsUploading(true)
        const patchData = await axios.patch('/imageActions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: {
            name : plainUsername,
            type: 'change'
          }
        });
        if(patchData.data.postStatus){
          window.open(`/${plainUsername}`,'_self')
        }else{
          switch (patchData.data.errorID) {
            case 1:
              window.open(`/${plainUsername}/setting/picture?type=add`,'_self')
              break;

            case 2:
              setError({
                status : 1,
                text : 'Sistemsel bir hata oluştu..'
              })
              break;
            default:
              break;
          }
        }
      }else{
        setError({
          status : true,
          text : 'Resim Yüklemeniz Gerekmektedir.'
        })
      }
    }
  return (
    <>
    {isUploading ? (
        <Loader title={'Resmini İşliyoruz..'}/>
      ) : (
        
      <div className='pictureArea'>
        {isAuth ? (
          type === 'add' ? (
            <>
            <h1>Profil Resmi Ekle</h1>
            <input type='file' onChange={handleFileChange}/>
            {error.status ? (
              <div id='error'>
                <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
                <span>{error.text}</span>
              </div>
            ) : (<></>)}
            <button type='submit' onClick={addImage}>Profil Resmini Ekle</button>
            </>
            ) : (
            <>
              <h1>Profil Resmini Düzenle</h1>
              <input type='file' onChange={handleFileChange}/>
              {error.status ? (
                <div id='error'>
                  <img src='/assest/img/GeneralIcons/circleWarn.svg' alt='Error İmage'/>
                  <span>{error.text}</span>
                </div>
              ) : (<></>)}
              <button type='submit' onClick={editImage}>Profil Resmini Düzenle</button>
            </>
          )
        ) : (
          <></>
        )}
        </div>
      )}
    </>
  )
}
