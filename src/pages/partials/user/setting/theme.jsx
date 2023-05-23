import React, { useEffect,useState } from 'react'
import axios from 'axios';
import './Theme.css'
const Theme = ({username,title,content}) => {
    const [isSaved, setIsSaved] = useState(false)
    const [biography, setBiography] = useState({
        biographyTitle : '',
        biographyContent : ''
    })
    useEffect(() => {
        setBiography({
        biographyTitle : title,
        biographyContent : content
      })
    }, [])
    const saveChanges = async() => {
      const change = await axios.put('/saveThemeChanges',{
        name : username,
        biography
      })
      if(change.data.status){
        setIsSaved(true)
      }else{
        alert('Bir hata oluştu.')
      }
      
    }
  return (
    <div className='themeOptions'>
        <div className="biographyTitle">
            <span>Biyografi Başlığı</span>
            <input
             type='text' 
            value={biography.biographyTitle}
            onChange={(e)=>setBiography(prev=>({...prev,biographyTitle : e.target.value}))}
            />
        </div>
        <div className="biographyContent">
          <span>Biyografi İçeriği</span>
          <textarea
          value={biography.biographyContent} 
          placeholder='Buraya biyografi içeriğini giriniz'
          onChange={(e)=>setBiography(prev=>({...prev,biographyContent : e.target.value}))}
          ></textarea>
        </div>
        {isSaved ? (
          <>Değişiklikler Kaydedildi</>
        ) : (
          <></>
        )}
        <button onClick={saveChanges}>Değişiklikleri Kaydet</button>
    </div>
  )
}

export default Theme